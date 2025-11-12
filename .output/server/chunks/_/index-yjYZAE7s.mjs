import { jsx, jsxs } from 'react/jsx-runtime';
import { u as useCartStore, b as useCategories, d as useProducts, t as transformProduct, G as GradientButton, c as cn } from './ssr.mjs';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import '@tanstack/react-query';
import '@tanstack/react-router';
import 'zustand';
import 'zustand/middleware';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-dialog';
import '@radix-ui/react-tooltip';
import '@radix-ui/react-avatar';
import '@radix-ui/react-dropdown-menu';
import './nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import '@tanstack/react-router/ssr/server';

function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart == null ? void 0 : onAddToCart(product.id);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-sm mx-auto overflow-hidden hover:shadow-lg transition-shadow", children: [
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: product.image,
        alt: product.name,
        className: "w-full h-48 object-cover",
        loading: "lazy"
      }
    ) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-4 flex flex-col h-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-center", children: product.name }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 py-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: product.ingredients.join(", ") }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-foreground", children: [
          product.price,
          " \u20B8"
        ] }),
        /* @__PURE__ */ jsxs(
          GradientButton,
          {
            onClick: handleAddToCart,
            variant: "gradient",
            size: "default",
            decorative: true,
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-1 rounded-xl border py-4 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const SplitComponent = function RouteComponent() {
  const addItem = useCartStore((state) => state.addItem);
  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useCategories();
  const {
    data: products = [],
    isLoading: productsLoading
  } = useProducts();
  const productsByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach((category) => {
      grouped[category.id] = products.filter((product) => product.category === category.id).map(transformProduct);
    });
    return grouped;
  }, [categories, products]);
  const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        image: product.image || ""
      });
      toast.success(`${product.name} \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443!`, {
        description: `\u0426\u0435\u043D\u0430: ${parseFloat(product.price)} \u20B8`,
        duration: 3e3,
        action: {
          label: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
          onClick: () => {
            const cartButton = document.querySelector("[data-cart-trigger]");
            cartButton == null ? void 0 : cartButton.click();
          }
        }
      });
    }
  };
  if (categoriesLoading || productsLoading) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-8", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." }) });
  }
  const renderSection = (category) => {
    const categoryProducts = productsByCategory[category.id] || [];
    if (categoryProducts.length === 0) return null;
    return /* @__PURE__ */ jsxs("section", { id: `category-${category.id}`, className: "mb-12 scroll-mt-28", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-8", children: category.name }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: categoryProducts.map((product) => /* @__PURE__ */ jsx(ProductCard, { product, onAddToCart: () => handleAddToCart(product.id) }, product.id)) })
    ] }, category.id);
  };
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-2 space-y-8", children: categories.map(renderSection) });
};

export { SplitComponent as component };
//# sourceMappingURL=index-yjYZAE7s.mjs.map
