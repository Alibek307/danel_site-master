from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import transaction
from .emails import send_order_confirmation_email
from .models import Category, Product, Customer, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CustomerSerializer, 
    OrderSerializer, CreateOrderSerializer, CustomerRegistrationSerializer,
    CustomerLoginSerializer, CustomerProfileSerializer, UpdateProfileSerializer,
    ChangePasswordSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True)
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        # Фильтр по статусу
        status_param = self.request.query_params.get('status', None)
        if status_param is not None:
            queryset = queryset.filter(status=status_param)
        return queryset.select_related('customer').prefetch_related('items__product')
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Создаем или получаем клиента
                    customer_data = serializer.validated_data['customer']
                    customer_id = customer_data.get('id')
                    if customer_id:
                        try:
                            customer = Customer.objects.get(id=customer_id, is_active=True)
                        except Customer.DoesNotExist:
                            return Response(
                                {'error': 'Клиент не найден'},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    else:
                        customer, created = Customer.objects.get_or_create(
                            phone=customer_data['phone'],
                            defaults={
                                'name': customer_data.get('name'),
                                'email': customer_data.get('email'),
                                'address': customer_data.get('address'),
                            }
                        )

                    # Создаем заказ
                    order = Order.objects.create(
                        customer=customer,
                        delivery_date=serializer.validated_data['delivery_date'],
                        payment_method = serializer.validated_data.get('payment_method', 'cash'),
                        notes=serializer.validated_data.get('notes', ''),
                        total_amount=0
                    )

                    # Добавляем товары в заказ
                    total_amount = 0
                    for item_data in serializer.validated_data['items']:
                        product = Product.objects.get(id=item_data['product_id'])
                        order_item = OrderItem.objects.create(
                            order=order,
                            product=product,
                            quantity=item_data['quantity'],
                            price=product.price
                        )
                        total_amount += order_item.total_price
                    
                    # Обновляем общую сумму заказа
                    order.total_amount = total_amount
                    order.save()
                
                    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
                
            except Product.DoesNotExist:
                return Response(
                    {'error': 'Один или несколько товаров не найдены'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {'error': 'Недопустимый статус'},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = order.status
        order.status = new_status
        order.save()

        # Отправляем email при подтверждении заказа
        if new_status == 'confirmed' and old_status != 'confirmed':
            if order.customer.email:
                send_order_confirmation_email(order)
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = CustomerRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.save()

        # Создаем токен с уникальными данными для каждого пользователя
        refresh = RefreshToken()
        refresh['customer_id'] = customer.id
        refresh['email'] = customer.email
        refresh['name'] = customer.name

        return Response({
            'customer': CustomerProfileSerializer(customer).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = CustomerLoginSerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.validated_data['customer']
        customer.update_last_login()

        # Создаем токен с уникальными данными для каждого пользователя
        refresh = RefreshToken()
        refresh['customer_id'] = customer.id
        refresh['email'] = customer.email
        refresh['name'] = customer.name

        return Response({
            'customer': CustomerProfileSerializer(customer).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'API Overview': '/api',
        'Categories': '/api/categories',
        'Product': '/api/products/',
        'Orders': '/api/orders/',
        'Create Order': '/api/orders/create_order',
        'Health Check': 'api/health',
    }
    return Response(api_urls)

@api_view(['GET'])
def hello_world(request):                                                                                                       
    return Response({"message": "Hello from Django!"}) 

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy", "message": "Django API is running"})

@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_profile(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    
    if not auth_header.startswith('Bearer '):
        return Response(
            {'error': 'Требуется аутентификация'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token = auth_header.split(' ')[1]

    try:
        from rest_framework_simplejwt.tokens import AccessToken
        access_token = AccessToken(token)
        customer_id = access_token.payload.get('customer_id')

        if not customer_id:
            return Response(
                {'error': 'Неверный токен'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        customer = Customer.objects.get(id=customer_id, is_active=True)

    except Exception as e:
        return Response(
            {'error': 'Неверный или истекший токен'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    serializer = UpdateProfileSerializer(customer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(CustomerProfileSerializer(customer).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_profile(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    
    if not auth_header.startswith('Bearer '):
        return Response(
            {'error': 'Требуется аутентификация'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token = auth_header.split(' ')[1]

    try:
        # Декодируем токен вручную
        from rest_framework_simplejwt.tokens import AccessToken
        access_token = AccessToken(token)
        customer_id = access_token.payload.get('customer_id')
            
        if not customer_id:
            return Response(
                {'error': 'Неверный токен'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        customer = Customer.objects.get(id=customer_id, is_active=True)
        return Response(CustomerProfileSerializer(customer).data)
        
    except Exception as e:
        return Response(
            {'error': 'Неверный или истекший токен'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
@api_view(['POST'])
@permission_classes([AllowAny])
def change_password(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')

    if not auth_header.startswith('Bearer '):
        return Response(
            {'error': 'Требуется аутентификация'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token = auth_header.split(' ')[1]

    try:
        from rest_framework_simplejwt.tokens import AccessToken
        access_token = AccessToken(token)
        customer_id = access_token.payload.get('customer_id')

        if not customer_id:
            return Response(
                {'error': 'Неверный токен'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        customer = Customer.objects.get(id=customer_id, is_active=True)
    
    except Exception as e:
        return Response(
            {'error': 'Неверный или истекший токен'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        # Проверяем старый пароль
        if not customer.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Неверный текущий пароль'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Устанавливаем новый пароль
        customer.set_password(serializer.validated_data['new_password'])
        customer.save()

        return Response({'message': 'Пароль успешно изменен'}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)