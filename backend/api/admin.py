from django.contrib import admin
from django.utils.html import format_html
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
    list_display = ['id', 'customer', 'colored_status', 'total_amount', 'delivery_date', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at', 'delivery_date']
    search_fields = ['customer__name', 'customer__phone', 'customer__email']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at', 'total_amount']

    fieldsets = (
        ('Информация о заказе', {
            'fields': ('customer', 'status', 'total_amount')
        }),
        ('Доставка и оплата', {
            'fields': ('delivery_date', 'payment_method', 'notes')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('customer')
    
    def colored_status(self, obj):
        colors = {
            'pending': '#FFA500',      # Оранжевый
            'confirmed': '#4169E1',    # Синий
            'preparing': '#9370DB',    # Фиолетовый
            'ready': '#32CD32',        # Зеленый
            'delivered': '#228B22',    # Темно-зеленый
            'cancelled': '#DC143C',    # Красный
        }
        status_labels = {
            'pending': 'В ожидании',
            'confirmed': 'Подтвержден',
            'preparing': 'Готовится',
            'ready': 'Готов',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен',
        }
        color = colors.get(obj.status, '#808080')
        label = status_labels.get(obj.status, obj.status)
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            label
        )
    colored_status.short_description = 'Статус'
    colored_status.admin_order_field = 'status'