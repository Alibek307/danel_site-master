import { jsx, jsxs } from 'react/jsx-runtime';
import { useQuery } from '@tanstack/react-query';
import { o as ordersApi } from './ssr.mjs';
import { ShoppingBag, Package, Calendar, Clock } from 'lucide-react';
import '@tanstack/react-router';
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

const SplitComponent = function OrdersPage() {
  const {
    data: orders = [],
    isLoading
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.getAll()
  });
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442",
        color: "bg-yellow-500/10 text-yellow-600"
      },
      confirmed: {
        label: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D",
        color: "bg-blue-500/10 text-blue-600"
      },
      preparing: {
        label: "\u0413\u043E\u0442\u043E\u0432\u0438\u0442\u0441\u044F",
        color: "bg-purple-500/10 text-purple-600"
      },
      ready: {
        label: "\u0413\u043E\u0442\u043E\u0432",
        color: "bg-green-500/10 text-green-600"
      },
      delivered: {
        label: "\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D",
        color: "bg-gray-500/10 text-gray-600"
      },
      cancelled: {
        label: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D",
        color: "bg-red-500/10 text-red-600"
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${config.color}`, children: config.label });
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-8", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u043A\u0430\u0437\u043E\u0432..." }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(ShoppingBag, { className: "w-8 h-8" }),
      "\u041C\u043E\u0438 \u0437\u0430\u043A\u0430\u0437\u044B"
    ] }),
    orders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(Package, { className: "w-16 h-16 mx-auto mb-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "\u0423 \u0432\u0430\u0441 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u043A\u0430\u0437\u043E\u0432" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u0439 \u0437\u0430\u043A\u0430\u0437, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0435\u0433\u043E \u0437\u0434\u0435\u0441\u044C" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: orders.map((order) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-6 hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-1", children: [
            "\u0417\u0430\u043A\u0430\u0437 #",
            order.id
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
              formatDate(order.created_at)
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
              "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430: ",
              formatDate(order.delivery_date)
            ] })
          ] })
        ] }),
        getStatusBadge(order.status)
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-4", children: order.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          item.product_name,
          " \xD7 ",
          item.quantity
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
          parseFloat(item.price) * item.quantity,
          " \u20B8"
        ] })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "\u0418\u0442\u043E\u0433\u043E:" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold", children: [
          parseFloat(order.total_amount),
          " \u20B8"
        ] })
      ] }),
      order.notes && /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439:" }),
        " ",
        order.notes
      ] }) })
    ] }, order.id)) })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=index-ZiE1nzJu.mjs.map
