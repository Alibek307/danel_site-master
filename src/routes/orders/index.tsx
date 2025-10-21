import { createFileRoute } from "@tanstack/react-router";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/shared/api/services";
import { ShoppingBag, Calendar, Clock, Package } from "lucide-react";
import type { Order } from "@/shared/types/api";

export const Route = createFileRoute('/orders/')({
  beforeLoad: ({ context, location }) => {
    const authStore = useAuthStore.getState();

    if (!authStore.tokens?.access || !authStore.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: OrdersPage,
});

function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getAll(),
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Ожидает', color: 'bg-yellow-500/10 text-yellow-600' },
      confirmed: { label: 'Подтвержден', color: 'bg-blue-500/10 text-blue-600' },
      preparing: { label: 'Готовится', color: 'bg-purple-500/10 text-purple-600' },
      ready: { label: 'Готов', color: 'bg-green-500/10 text-green-600' },
      delivered: { label: 'Доставлен', color: 'bg-gray-500/10 text-gray-600' },
      cancelled: { label: 'Отменен', color: 'bg-red-500/10 text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" />
          Мои заказы
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">У вас пока нет заказов</h2>
            <p className="text-muted-foreground">
              Оформите первый заказ, чтобы увидеть его здесь
            </p>
          </div>
        ): (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                {/* Шапка заказа */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      Заказ #{order.id}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Доставка: {formatDate(order.delivery_date)}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Товары в заказе */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {parseFloat(item.price) * item.quantity} ₸
                      </span>
                    </div>
                  ))}
                </div>

                {/* Итого */}
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-muted-foreground">Итого:</span>
                  <span className="text-xl font-bold">
                    {parseFloat(order.total_amount)} ₸
                  </span>
                </div>

                {/* Примечания */}
                {order.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Коментарий:</span> {order.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}