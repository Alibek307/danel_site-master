import { Card, CardContent, GradientButton } from '@/shared/components';
import { Plus } from 'lucide-react';

export interface ProductData {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  price: number;
}

// Backward compatibility
export type PieData = ProductData;

interface ProductCardProps {
  product: ProductData;
  onAddToCart?: (productId: string) => void;
}

// Backward compatibility
interface PieCardProps {
  pie: PieData;
  onAddToCart?: (pieId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(product.id);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
      
      <CardContent className="p-4 flex flex-col h-full">
        <h3 className="font-semibold text-lg text-center">{product.name}</h3>
        
        <div className="flex-1 py-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.ingredients.join(', ')}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-bold text-foreground">
            {product.price} ₸
          </div>
          
          <GradientButton 
            onClick={handleAddToCart}
            variant="gradient"
            size="default"
            decorative
          >
            <Plus className="w-4 h-4" />
            Добавить
          </GradientButton>
        </div>
      </CardContent>
    </Card>
  );
}

// Backward compatibility
export function PieCard({ pie, onAddToCart }: PieCardProps) {
  return <ProductCard product={pie} onAddToCart={onAddToCart} />;
}