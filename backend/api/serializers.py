from rest_framework import serializers
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
    notes = serializers.CharField(required=False, allow_blank=True)