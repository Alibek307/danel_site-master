import { createFileRoute } from '@tanstack/react-router';
import { getBaseMeta, combineSEO, getJsonLd } from '@/shared/lib/seo';
import { ProductCard, type ProductData } from '@/shared/components';
import { useCartStore } from '@/shared/stores';
import { toast } from 'sonner';
import { m } from 'src/paraglide/messages';
import { WebSite } from 'schema-dts';
import { localizeHref } from 'src/paraglide/runtime';

// Sample data for all categories
const categoriesData: {
  pies: ProductData[];
  salads: ProductData[];
  hot: ProductData[];
  snacks: ProductData[];
  cakes: ProductData[];
} = {
  pies: [
    {
      id: 'chicken-pie',
      name: 'Куриный пирог',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['куриное филе', 'лук', 'морковь', 'картофель', 'специи', 'слоеное тесто'],
      price: 1200
    },
    {
      id: 'meat-pie',
      name: 'Мясной пирог',
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['говядина', 'лук', 'морковь', 'томатная паста', 'специи', 'дрожжевое тесто'],
      price: 1500
    },
    {
      id: 'apple-pie',
      name: 'Яблочный пирог',
      image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e9b5?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['яблоки', 'сахар', 'корица', 'сливочное масло', 'мука', 'яйца'],
      price: 900
    }
  ],
  salads: [
    {
      id: 'caesar-salad',
      name: 'Цезарь',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['салат романо', 'куриная грудка', 'пармезан', 'сухарики', 'соус цезарь'],
      price: 800
    },
    {
      id: 'greek-salad',
      name: 'Греческий салат',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['помидоры', 'огурцы', 'сыр фета', 'маслины', 'красный лук', 'оливковое масло'],
      price: 650
    },
    {
      id: 'olivier-salad',
      name: 'Оливье',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['картофель', 'морковь', 'яйца', 'колбаса', 'горошек', 'майонез'],
      price: 550
    }
  ],
  hot: [
    {
      id: 'beef-steak',
      name: 'Говяжий стейк',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['говядина', 'специи', 'масло', 'гарнир из овощей'],
      price: 2500
    },
    {
      id: 'chicken-pasta',
      name: 'Паста с курицей',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['паста', 'куриное филе', 'сливки', 'грибы', 'пармезан'],
      price: 1200
    },
    {
      id: 'fish-grill',
      name: 'Рыба на гриле',
      image: 'https://images.unsplash.com/photo-1544943910-4552f48d4065?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['лосось', 'лимон', 'травы', 'овощи на гриле'],
      price: 1800
    }
  ],
  snacks: [
    {
      id: 'chicken-wings',
      name: 'Куриные крылышки',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['куриные крылья', 'острый соус', 'сельдерей', 'соус блю-чиз'],
      price: 750
    },
    {
      id: 'cheese-sticks',
      name: 'Сырные палочки',
      image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['моцарелла', 'панировочные сухари', 'соус маринара'],
      price: 500
    },
    {
      id: 'potato-wedges',
      name: 'Картофельные дольки',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['картофель', 'специи', 'сметанный соус'],
      price: 400
    }
  ],
  cakes: [
    {
      id: 'chocolate-cake',
      name: 'Шоколадный торт',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['шоколад', 'мука', 'яйца', 'сахар', 'сливочное масло', 'какао'],
      price: 1500
    },
    {
      id: 'cheesecake',
      name: 'Чизкейк',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['творожный сыр', 'печенье', 'сахар', 'яйца', 'ванилин'],
      price: 1200
    },
    {
      id: 'tiramisu',
      name: 'Тирамису',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=faces',
      ingredients: ['маскарпоне', 'савоярди', 'кофе', 'какао', 'яйца', 'сахар'],
      price: 1100
    }
  ]
} as const;

export const Route = createFileRoute('/')({
  head: () => {
    const baseMeta = getBaseMeta({
      title: m.seo_home_title(),
      description: m.seo_home_description(),
      keywords: m.seo_home_keywords(),
      // canonicalUrl: localizeHref('https://www.jasalab.com/'),
    });

    // const websiteSchema = getJsonLd<WebSite>({
    //   '@type': 'WebSite',
    //   name: 'JasaLab',
    //   description: m.seo_home_description(),
    //   url: localizeHref('https://www.jasalab.com'),
    // });

    return combineSEO(baseMeta);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (productId: string) => {
    // Find product in all categories
    const allProducts = [
      ...categoriesData.pies,
      ...categoriesData.salads,
      ...categoriesData.hot,
      ...categoriesData.snacks,
      ...categoriesData.cakes,
    ];
    
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      
      // Show success toast
      toast.success(`${product.name} добавлен в корзину!`, {
        description: `Цена: ${product.price} ₸`,
        duration: 3000,
        action: {
          label: "Открыть корзину",
          onClick: () => {
            // This will be handled by the CartSheet component
            const cartButton = document.querySelector('[data-cart-trigger]') as HTMLElement;
            cartButton?.click();
          },
        },
      });
    }
  };

  const renderSection = (title: string, products: ProductData[], id: string) => (
    <section id={id} className="mb-12 scroll-mt-28">
      <h2 className="text-3xl font-bold mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="container mx-auto px-6 py-2 space-y-8">
      {renderSection('Пироги', categoriesData.pies, 'pies')}
      {renderSection('Салаты', categoriesData.salads, 'salads')}
      {renderSection('Горячее', categoriesData.hot, 'hot')}
      {renderSection('Закуски', categoriesData.snacks, 'snacks')}
      {renderSection('Торты', categoriesData.cakes, 'cakes')}
    </div>
  );
}
