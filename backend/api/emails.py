from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_order_confirmation_email(order):
    """Отправляет email подтверждение заказа клиенту"""
    subject = f'Заказ {order.order_number} подтвержден'

    # Формируем список товаров
    items_list = []
    for item in order.items.all():
        items_list.append({
            'name': item.product.name,
            'quantity': item.quantity,
            'price': item.price,
            'total': item.total_price
        })

    # Форматируем дату доставки
    delivery_date = order.delivery_date.strtime('%d.%m.%Y %H:%M')

    # Формируем текст письма
    message = f"""
Здравствуйте, {order.customer.name}!

Ваш заказ {order.order_number} подтвержден и принят в работу.

Детали заказа:
-----------------
Дата доставки: {delivery_date}
Способ оплаты: {order.get_payment_method_display()}

Товары:
"""
    
    for item in items_list:
        message += f"\n- {item['name']} x {item['quantity']} = {item['total']} тг"
    
    message += f"""

-----------------
Итого: {order.total_amount} тг

Примечания: {order.notes if order.notes else 'Нет'}

Спасибо за ваш заказ!

С уважением,
Команда Danel
"""

    # Отправляем email
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=setting.DEFAULT_FROM_EMAIL,
            recipient_list=[order.customer.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Ошибка отправки email: {e}")
        return False