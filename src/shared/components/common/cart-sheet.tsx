import { useCartStore } from '@/shared/stores/cart-store';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  GradientButton,
  Separator 
} from '@/shared/components';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

interface CartSheetProps {
  trigger?: React.ReactNode;
}

export function CartSheet({ trigger }: CartSheetProps) {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const defaultTrigger = (
    <div className="relative">
      <GradientButton
        variant="gradient"
        size="default"
        className="text-lg font-bold"
        data-cart-trigger
        decorative
      >
        <ShoppingCart className="w-5 h-5" />
        Корзина
      </GradientButton>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold border-2 border-purple-200">
          {totalItems}
        </span>
      )}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Корзина ({totalItems})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Корзина пуста</p>
                <p className="text-sm text-muted-foreground">Добавьте товары для заказа</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-sm text-foreground">{item.price} ₸</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <GradientButton
                            variant="gradient"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </GradientButton>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <GradientButton
                            variant="gradient"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </GradientButton>
                          
                          <GradientButton
                            variant="gradient-red"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeItem(item.id)}
                            decorative
                            decorativeColor="red"
                          >
                            <Trash2 className="w-3 h-3" />
                          </GradientButton>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-sm text-foreground">
                          {item.price * item.quantity} ₸
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="container mx-auto p-6 space-y-8 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Итого:</span>
                  <span className="text-lg font-bold text-foreground">
                    {totalPrice} ₸
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <GradientButton 
                    onClick={clearCart}
                    variant="gradient-gray"
                    size="lg"
                    className="w-full px-4 py-3"
                    decorative
                    decorativeColor="gray"
                  >
                    Очистить
                  </GradientButton>
                  <GradientButton 
                    variant="gradient"
                    size="lg"
                    className="w-full px-4 py-3 font-semibold"
                    decorative
                    decorativeColor="purple"
                  >
                    Заказать
                  </GradientButton>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}