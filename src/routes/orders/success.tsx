import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { GradientButton } from '@/shared/components';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

export const Route = createFileRoute('/orders/success')({
  component: OrderSuccessPage,
});

function OrderSuccessPage(){
  const navigate = useNavigate();
  const search = useSearch({ from: '/orders/success' });

  const orderId = (search as any).orderId;

  return (
    <div className='container mx-auto px-6 py-12'>
      <div className='max-w-2xl mx-auto text-center'>
        {/* Иконка успеха */}
        <div className='mb-6 flex justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20'></div>
            <CheckCircle className='w-24 h-24 text-green-500 relative' />
          </div>
        </div>

        {/* Заголовок */}
        <h1 className='text-4xl font-bold mb-4'>Заказ успешно оформлен!</h1>
        
        {/* Номер заказа */}
        {orderId && (
          <div className='mb-6'>
            <p className='text-muted-foreground mb-2'>Номер вашего заказа:</p>
            <div className='inline-block bg-muted px-6 py-3 rounded-lg'>
              <span className='text-2xl font-bold text-foreground'>#{orderId}</span>
            </div>
          </div>
        )}

        {/* Описание */}
        <p className='text-lg text-muted-foreground mb-8'>
          Мы получили ваш заказ и начнем его обработку в ближайшее время.
          <br />
          Информация о статусе заказа будет отправлена на вашу почту.
        </p>

        {/* Кнопки */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <GradientButton
            variant="gradient"
            size="lg"
            onClick={() => navigate({ to: '/' })}
            decorative
            className='gap-2'
          >
            <Home className='w-5 h-5' />
            На главную
          </GradientButton>

          <GradientButton
            variant="gradient"
            size="lg"
            onClick={() => navigate({ to: '/orders' })}
            decorative
            decorativeColor='purple'
            className='gap-2'
          >
            <ShoppingBag className='w-5 h-5' />
            Мои заказы
          </GradientButton>
        </div>

        {/* Дополнительная информация */}
        <div className='mt-12 pt-8 border-t'>
          <h3 className='font-semibold mb-4'>Что дальше?</h3>
          <div className='grid md:grid-cols-3 gap-6 text-sm'>
            <div>
              <div className='w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-2xl'>📋</span>
              </div>
              <p className='font-medium mb-1'>Обработка</p>
              <p className='text-muted-foreground'>
                Мы проверим наличие товаров и подтвердим заказ
              </p>
            </div>

            <div>
              <div className='w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-2xl'>👨‍🍳</span>
              </div>
              <p className='font-medium mb-1'>Приготовление</p>
              <p className='text-muted-foreground'>
                Ваш заказ будет подготовлен нашими поварами
              </p>
            </div>

            <div>
              <div className='w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                <span className='text-2xl'>🚚</span>
              </div>
              <p className='font-medium mb-1'>Доставка</p>
              <p className='text-muted-foreground'>
                Доставим в указанное вами время
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}