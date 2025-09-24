import { createFileRoute } from '@tanstack/react-router';
import { getBaseMeta, combineSEO, getJsonLd } from '@/shared/lib/seo';
import { ProductCard, type ProductData } from '@/shared/components';
import { useCartStore } from '@/shared/stores';
import { useCategories, useProducts, transformProduct } from '@/shared/hooks/useProduct';
import { toast } from 'sonner';
import { m } from 'src/paraglide/messages';
import { useMemo } from 'react';

export const Route = createFileRoute('/')({
  head: () => {
    const baseMeta = getBaseMeta({
      title: m.seo_home_title(),
      description: m.seo_home_description(),
      keywords: m.seo_home_keywords(),
    });

    return combineSEO(baseMeta);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const addItem = useCartStore((state) => state.addItem);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: products = [], isLoading: productsLoading  } = useProducts();

  const productsByCategory = useMemo(() => {
    const grouped: Record<number, ProductData[]> = {};

    categories.forEach(category => {
      grouped[category.id] = products
        .filter(product => product.category === category.id)
        .map(transformProduct);
    });

    return grouped;
  }, [categories, products]);

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        image: product.image || '',
      });

      toast.success(`${product.name} добавлен в корзину!`, {
        description: `Цена: ${parseFloat(product.price)} ₸`,
        duration: 3000,
        action: {
          label: "Открыть корзину",
          onClick: () => {
            const cartButton = document.querySelector('[data-cart-trigger]') as HTMLElement;
            cartButton?.click();
          },
        },
      });
    }
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  const renderSection = (category: { id: number; name: string }) => {
    const categoryProducts = productsByCategory[category.id] || [];

    if (categoryProducts.length === 0) return null;

    return (
      <section key={category.id} id={`category-${category.id}`} className="mb-12 scroll-mt-28">
        <h2 className="text-2xl font-bold mb-8">{category.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product.id)}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="container mx-auto px-6 py-2 space-y-8">
      {categories.map(renderSection)}
    </div>
  );
}
