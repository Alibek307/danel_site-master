from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.db import transaction
from .models import Category, Product, Customer, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, CustomerSerializer, 
    OrderSerializer, CreateOrderSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = ProductSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer

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
        return queryset.select_related('customer').prefetch_related('items_product')
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Создаем или получаем клиента
                    customer_data = serializer.validated_data['customer']
                    customer, created = Customer.objects.get_or_create(
                        phone=customer_data['phone'],
                        defaults=customer_data
                    )

                    # Создаем заказ
                    order = Order.objects.create(
                        customer=customer,
                        delivery_date=serializer.validated_data['delivery_date'],
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
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')

        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            return Response(OrderSerializer(order).data)
        
        return Response(
            {'error': 'Недопустимый статус'},
            status=status.HTTP_400_BAD_REQUEST
        )

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

