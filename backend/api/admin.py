from django.contrib import admin
from .models import Category, Product, Customer, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'weight', 'is_available', 'created_at']
    list_filter = ['category', 'is_available', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_available']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_active', 'created_at', 'last_login']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'phone', 'email']
    readonly_fields = ['password', 'created_at', 'last_login']
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'email', 'phone', 'address')
        }),
        ('Статус', {
            'fields': ('is_active', 'last_login', 'created_at')
        }),
        ('Безопасность', {
            'fields': ('password',),
            'classes': ('collapse',)
        }),
    )

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'status', 'total_amount', 'delivery_date', 'created_at']
    list_filter = ['status', 'created_at', 'delivery_date']
    search_fields = ['customer_name', 'customer_phone']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('customer')