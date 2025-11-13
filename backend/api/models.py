from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название")
    description = models.TextField(verbose_name="Описание")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категории")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Изображение")
    is_available = models.BooleanField(default=True, verbose_name="Доступен")
    weight = models.IntegerField(help_text="Вес в граммах", verbose_name="Вес (г)")
    ingredients = models.TextField(blank=True, verbose_name="Состав")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(unique=True, verbose_name="Email")
    password = models.CharField(max_length=128, verbose_name="Пароль")
    address = models.TextField(verbose_name="Адрес")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    last_login = models.DateTimeField(null=True, blank=True, verbose_name="Последний вход")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Клиент"
        verbose_name_plural = "Клиенты"
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def update_last_login(self):
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    def __str__(self):
        return f"{self.name} - {self.phone}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает подтверждения'),
        ('confirmed', 'Подтвержден'),
        ('preparing', 'Готовится'),
        ('ready', 'Готов'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
    ]

    PAYMENT_CHOICES = [
        ('cash', 'Наличными'),
        ('card', 'Картой'),
        ('kaspi', 'Kaspi.kz'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, verbose_name="Клиент")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Статус")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash', verbose_name="Способ оплаты")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Сумма заказа")
    delivery_date = models.DateTimeField(verbose_name="Дата доставки")
    notes = models.TextField(blank=True, verbose_name="Примечания")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Заказ #{self.id} - {self.customer.name}"
    
    @property
    def order_number(self):
        return f"#{str(self.id).zfill(5)}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE, verbose_name="Заказ")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Продукт")
    quantity = models.PositiveIntegerField(verbose_name="Количество")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за единицу")

    class Meta:
        verbose_name = "Товар в заказе"
        verbose_name_plural = "Товары в заказе"
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def total_price(self):
        if self.price is not None and self.quantity is not None:
            return self.price * self.quantity
        return 0