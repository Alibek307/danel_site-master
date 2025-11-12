from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import Category, Product, Customer, Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class CreateOrderSerializer(serializers.Serializer):
    customer = CustomerSerializer()
    items = serializers.ListField(
        child=serializers.DictField()
    )
    delivery_date = serializers.DateTimeField()
    payment_method = serializers.CharField(required=False, default='cash')
    notes = serializers.CharField(required=False, allow_blank=True)

class CustomerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = ['name', 'email', 'phone', 'address', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Пароли не совпадают")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        customer = Customer(**validated_data)
        customer.set_password(password)
        customer.save()
        return customer

class CustomerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            customer = Customer.objects.get(email=email, is_active=True)
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Неверные учетные данные")
        
        if not customer.check_password(password):
            raise serializers.ValidationError("Неверные учетные данные")
        
        attrs['customer'] = customer
        return attrs

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'address', 'created_at', 'last_login']
        read_only_fields = ['id', 'created_at', 'last_login']