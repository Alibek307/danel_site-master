import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useCartStore } from '@/shared/stores';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { ordersApi } from '@/shared/api/services';
import { Button, Input, Label, Separator } from '@/shared/components';
import { GradientButton } from '@/shared/components';
import { toast } from 'sonner';
import { useState } from 'react';
import { Calendar, ShoppingCart, User, MapPin, Clock } from 'lucide-react';
import type { CreateOrderData } from '@/shared/types/api';

// Экспорт маршрута с проверкой авторизации
export const Route = createFileRoute('/checkout')({
  // beforeload выполняется ДО загрузки страницы
  beforeLoad: ({ context, location }) => {
    // получаем состояние авторизации
    const  authStore = useAuthStore.getState();

    // Если не авторизован - делаем редирект на логин
    if (!authStore.tokens?.access || !authStore.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          // Сохраняем текущий URL, чтобы после логина вернуться сюда
          redirect: location.href,
        },
      });
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Получаем данные из store
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const totalPrice = getTotalPrice();

  // Создаем форму 
  const form = useForm({
    defaultValues: {
      delivery_date: '',
      delivery_time: '',
      payment_method: 'cash',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      // Проверяем что пользователь есть
      if (!user) {
        toast.error('Необходимо войти в систему');
        return;
      }

      // Проверяем что корзина не пуста
      if (items.length === 0) {
        toast.error('Корзина пуста')
        return;
      }

      setIsLoading(true);
      try{
        const deliveryDateTime = `${value.delivery_date}T${value.delivery_time}:00`;

        const orderData: CreateOrderData = {
          customer: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            address: user.address,
          },
          items: items.map(item => ({
            product_id: parseInt(item.id),
            quantity: item.quantity,
          })),
          delivery_date: new Date(value.delivery_date).toISOString(),
          payment_method: value.payment_method,
          notes: value.notes,
        };

        const response = await ordersApi.create(orderData);

        toast.success('Заказ успешно оформлен!', {
          description: `Номер заказа: #${response.id}`,
        });

        clearCart();

        navigate({ to: '/orders/success', search: { orderId: response.id } });

      } catch (error: any) {
        console.error('Ошибка создания заказа:', error);
        toast.error('Не удалось создать заказ', {
          description: error.message || 'Попробуйте еще раз',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  if  (items.length === 0) {
    return (
      <div className='container mx-auto px-6 py-12'>
        <div className='max-w-2xl mx-auto text-center'>
          <ShoppingCart className='w-16 h-16 mx-auto mb-4 text-muted-foreground' />
          <h1 className='text-2xl font-bold mb-2'>Корзина пуста</h1>
          <p className='text-muted-foreground mb-6'>
            Добавьте товары в корзину для оформления заказа
          </p>
          <GradientButton
            variant="gradient"
            onClick={() => navigate({ to: '/'})}
          >
            Перейти к каталогу
          </GradientButton>
        </div>
      </div>
    );
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // +1 day
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Оформления заказа</h1>

        {/* Двухколоночная сетка: форма слева, сводка справа */}
        <div className='grid md:grid-cols-3 gap-8'>

          {/* ЛЕВАЯ КОЛОНКА - Форма заказа */}
          <div className='md:col-span-2 space-y-6'>

            {/* Блок 1: Информация о заказчике (только просмотр) */}
            <div className='border rounded-lg p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <User className='w-5 h-5' />
                <h2 className='text-xl font-semibold'>Информация о компании</h2>
              </div>
              <div className='space-y-3 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Компания:</span>{' '}
                  <span className='font-medium'>{user?.name}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Телефон:</span>{' '}
                  <span className='font-medium'>{user?.phone}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Email:</span>{' '}
                  <span className='font-medium'>{user?.email}</span>
                </div>
                <div className='flex items-start gap-2'>
                  <MapPin className='w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0' />
                  <span className='font-medium'>{user?.address}</span>
                </div>
              </div>
            </div>

            {/* Блок 2: Детали доставки (форма) */}
            <div className='border rounded-lg p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Clock className='w-5 h-5' />
                <h2 className='text-xl font-semibold'>Детали доставки</h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className='space-y-4'
              >
                {/* Поле: Дата и время доставки */}
                <form.Field
                  name="delivery_date"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Выберите дату доставки';

                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      if (selectedDate <= today) {
                        return 'Минимальная дата доставки - завтра';
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className='space-y-2'>
                      <Label htmlFor={field.name}>
                        <Calendar className='w-4 h-4 inline mr-2' />
                        Дата доставки *
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        min={minDateString}
                        disabled={isLoading}
                        aria-invalid={!!field.state.meta.errors.length}
                      />
                      {/* Показываем ошибки валидации */}
                      {field.state.meta.errors && (
                        <p className='text-sm text-destructive'>
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                { /* Поле: Время доставки */}
                <form.Field 
                  name="delivery_time"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Выберите время доставки';
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className='space-y-2'>
                      <Label htmlFor={field.name}>
                        <Clock className='w-4 h-4 inline mr-2' />
                        Время доставки *
                      </Label>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isLoading}
                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <option value="">Выберите время</option>
                        <option value="07:00">07:00 - 08:00</option>
                        <option value="08:00">08:00 - 09:00</option>
                        <option value="09:00">09:00 - 10:00</option>
                        <option value="10:00">10:00 - 11:00</option>
                        <option value="11:00">11:00 - 12:00</option>
                        <option value="12:00">12:00 - 13:00</option>
                        <option value="13:00">13:00 - 14:00</option>
                        <option value="14:00">14:00 - 15:00</option>
                        <option value="15:00">15:00 - 16:00</option>
                        <option value="16:00">16:00 - 17:00</option>
                        <option value="17:00">17:00 - 18:00</option>
                      </select>
                      {field.state.meta.errors && (
                        <p className='text-sm text-destructive'>
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Поле: Комментарий к заказу (опционально) */}
                <form.Field name="notes">
                  {(field) => (
                    <div className='space-y-2'>
                      <Label htmlFor={field.name}>Комментарий к заказу</Label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='Дополнительные пожелания или инструкции...'
                        disabled={isLoading}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )}
                </form.Field>

                {/* Блок: Способ оплаты */}
                <div className='space-y-3'>
                  <Label className='text-base'>
                    <span className='inline-flex items-center gap-2'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Способ оплаты *
                    </span>
                  </Label>

                  <form.Field
                    name="payment_method"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Выберите способ оплаты';
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <div className='space-y-3'>
                        {/* Опция: Наличные */}
                        <label
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                            field.state.value === 'cash'
                              ? 'border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20'
                              : 'border-input hover:border-purple-300'
                          }`}
                        >
                          <input
                            type='radio'
                            name={field.name}
                            value="cash"
                            checked={field.state.value === 'cash'}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className='mt-1'
                            />
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-2xl'>💵</span>
                              <span className='font-semibold'>Наличными при получении</span>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              Оплата наличными при доставке заказа
                            </p>
                          </div>
                        </label>

                        {/* Опция: Картой на сайте */}
                        <label
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                            field.state.value === 'card'
                              ? 'border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20'
                              : 'border-input hover:border-purple-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value="card"
                            checked={field.state.value === 'card'}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className='mt-1'
                          />
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-2xl'>💳</span>
                              <span className='font-semibold'>Картой на сайте</span>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              Онлайн оплата банковской картой (Visa, Mastercard)
                            </p>
                          </div>
                        </label>

                        {/* Опция: Kaspi.kz */}
                        <label
                          className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                            field.state.value === 'kaspi'
                              ? 'border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20'
                              : 'border-input hover:border-purple-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value="kaspi"
                            checked={field.state.value === 'kaspi'}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className='mt-1'
                          />
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-2xl'>🔴</span>
                              <span className='font-semibold'>Kaspi.kz</span>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              Оплата через Kaspi QR или перевод на номер
                            </p>
                          </div>
                        </label>

                        {field.state.meta.errors && (
                          <p className='text-sm text-destructive'>
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Кнопка отправки */}
                <form.Subscribe 
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <GradientButton
                      type="submit"
                      disabled={!canSubmit || isLoading || items.length === 0}
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      decorative
                    >
                      {isLoading ? 'Оформление...' : `Оформить заказ на ${totalPrice} ₸`}
                    </GradientButton>
                  )}
                </form.Subscribe>
              </form>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА - Сводка заказа */}
          <div className='md:col-span-1'>
            <div className='border rounded-lg p-6 sticky top-4'>
              <h2 className='text-xl font-semibold mb-4'>Ваш заказ</h2>

              {/* Список товаров */}
              <div className='space-y-3 mb-4'>
                {items.map((item) => (
                  <div key={item.id} className='flex justify-between items-start text-sm'>
                    <div className='flex-1'>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-muted-foreground'>
                        {item.quantity} × {item.price} ₸
                      </p>
                    </div>
                    <p className='font-semibold'>
                      {item.quantity * item.price} ₸
                    </p>
                  </div>
                ))}
              </div>

              <Separator className='my-4'/>

              {/* Итого */}
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Товаров:</span>
                  <span>{items.length}</span>
                </div>
                <div className='flex justify-between text-lg font-bold'>
                  <span>Итого:</span>
                  <span className='text-foreground'>{totalPrice} ₸</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
