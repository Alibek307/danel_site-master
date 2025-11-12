import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { G as GradientButton } from './ssr.mjs';
import '@tanstack/react-query';
import 'react';
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
import 'sonner';
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

const SplitComponent = function OrderSuccessPage() {
  const navigate = useNavigate();
  const search = useSearch({
    from: "/orders/success"
  });
  const orderId = search.orderId;
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20" }),
      /* @__PURE__ */ jsx(CheckCircle, { className: "w-24 h-24 text-green-500 relative" })
    ] }) }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "\u0417\u0430\u043A\u0430\u0437 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D!" }),
    orderId && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-2", children: "\u041D\u043E\u043C\u0435\u0440 \u0432\u0430\u0448\u0435\u0433\u043E \u0437\u0430\u043A\u0430\u0437\u0430:" }),
      /* @__PURE__ */ jsx("div", { className: "inline-block bg-muted px-6 py-3 rounded-lg", children: /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-foreground", children: [
        "#",
        orderId
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-lg text-muted-foreground mb-8", children: [
      "\u041C\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u0432\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 \u0438 \u043D\u0430\u0447\u043D\u0435\u043C \u0435\u0433\u043E \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0432 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F.",
      /* @__PURE__ */ jsx("br", {}),
      "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0435 \u0437\u0430\u043A\u0430\u0437\u0430 \u0431\u0443\u0434\u0435\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0430 \u043D\u0430 \u0432\u0430\u0448\u0443 \u043F\u043E\u0447\u0442\u0443."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
      /* @__PURE__ */ jsxs(GradientButton, { variant: "gradient", size: "lg", onClick: () => navigate({
        to: "/"
      }), decorative: true, className: "gap-2", children: [
        /* @__PURE__ */ jsx(Home, { className: "w-5 h-5" }),
        "\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E"
      ] }),
      /* @__PURE__ */ jsxs(GradientButton, { variant: "gradient", size: "lg", onClick: () => navigate({
        to: "/orders"
      }), decorative: true, decorativeColor: "purple", className: "gap-2", children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "w-5 h-5" }),
        "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "\u0427\u0442\u043E \u0434\u0430\u043B\u044C\u0448\u0435?" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F4CB}" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "\u041C\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C \u043D\u0430\u043B\u0438\u0447\u0438\u0435 \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043C \u0437\u0430\u043A\u0430\u0437" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F468}\u200D\u{1F373}" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "\u041F\u0440\u0438\u0433\u043E\u0442\u043E\u0432\u043B\u0435\u043D\u0438\u0435" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "\u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437 \u0431\u0443\u0434\u0435\u0442 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043B\u0435\u043D \u043D\u0430\u0448\u0438\u043C\u0438 \u043F\u043E\u0432\u0430\u0440\u0430\u043C\u0438" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F69A}" }) }),
          /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "\u0414\u043E\u0441\u0442\u0430\u0432\u0438\u043C \u0432 \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u043E\u0435 \u0432\u0430\u043C\u0438 \u0432\u0440\u0435\u043C\u044F" })
        ] })
      ] })
    ] })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=success-hJfm7bWq.mjs.map
