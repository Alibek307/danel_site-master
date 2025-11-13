import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { u as useForm, L as Label } from './useForm-CSs12aQO.mjs';
import { u as useCartStore, a as useAuthStore, G as GradientButton, o as ordersApi, c as cn } from './ssr.mjs';
import { toast } from 'sonner';
import { useState } from 'react';
import { ShoppingCart, User, MapPin, Clock, Calendar } from 'lucide-react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import '@radix-ui/react-label';
import '@tanstack/react-query';
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

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
const SplitComponent = function CheckoutPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    items,
    getTotalPrice,
    clearCart
  } = useCartStore();
  const {
    user
  } = useAuthStore();
  const totalPrice = getTotalPrice();
  const form = useForm({
    defaultValues: {
      delivery_date: "",
      delivery_time: "",
      payment_method: "cash",
      notes: ""
    },
    onSubmit: async ({
      value
    }) => {
      if (!user) {
        toast.error("\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0432\u043E\u0439\u0442\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443");
        return;
      }
      if (items.length === 0) {
        toast.error("\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430");
        return;
      }
      setIsLoading(true);
      try {
        const deliveryDateTime = `${value.delivery_date}T${value.delivery_time}:00`;
        const orderData = {
          customer: user ? {
            id: user.id
          } : void 0,
          items: items.map((item) => ({
            product_id: Number(item.id),
            quantity: item.quantity,
            price: item.price.toString()
          })),
          delivery_date: deliveryDateTime,
          payment_method: value.payment_method,
          notes: value.notes
        };
        const response = await ordersApi.create(orderData);
        toast.success("\u0417\u0430\u043A\u0430\u0437 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D!", {
          description: `\u041D\u043E\u043C\u0435\u0440 \u0437\u0430\u043A\u0430\u0437\u0430: #${response.id}`
        });
        clearCart();
        navigate({
          to: "/orders/success",
          search: {
            orderId: response.id
          }
        });
      } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430:", error);
        toast.error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u043A\u0430\u0437", {
          description: error.message || "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437"
        });
      } finally {
        setIsLoading(false);
      }
    }
  });
  if (items.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx(ShoppingCart, { className: "w-16 h-16 mx-auto mb-4 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-2", children: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u0443\u0441\u0442\u0430" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: "\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0442\u043E\u0432\u0430\u0440\u044B \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443 \u0434\u043B\u044F \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430" }),
      /* @__PURE__ */ jsx(GradientButton, { variant: "gradient", onClick: () => navigate({
        to: "/"
      }), children: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0443" })
    ] }) });
  }
  const minDate = /* @__PURE__ */ new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.toISOString().split("T")[0];
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8", children: "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u043A\u0430\u0437\u0430" }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx(User, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "\u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: user == null ? void 0 : user.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: user == null ? void 0 : user.phone })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Email:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: user == null ? void 0 : user.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: user == null ? void 0 : user.address })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "\u0414\u0435\u0442\u0430\u043B\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }, className: "space-y-4", children: [
            /* @__PURE__ */ jsx(form.Field, { name: "delivery_date", validators: {
              onChange: ({
                value
              }) => {
                if (!value) return "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438";
                return void 0;
              }
            }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs(Label, { children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 inline mr-2" }),
                "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0430\u0442\u0443 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 *"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: [1, 2, 3, 4, 5].map((dayOffset) => {
                const date = /* @__PURE__ */ new Date();
                date.setDate(date.getDate() + dayOffset);
                const dateString = date.toISOString().split("T")[0];
                const dayLabel = dayOffset === 1 ? "\u0417\u0430\u0432\u0442\u0440\u0430" : date.getDate().toString();
                const monthNames = ["\u044F\u043D\u0432", "\u0444\u0435\u0432", "\u043C\u0430\u0440", "\u0430\u043F\u0440", "\u043C\u0430\u0439", "\u0438\u044E\u043D", "\u0438\u044E\u043B", "\u0430\u0432\u0433", "\u0441\u0435\u043D", "\u043E\u043A\u0442", "\u043D\u043E\u044F", "\u0434\u0435\u043A"];
                const monthLabel = monthNames[date.getMonth()];
                const isSelected = field.state.value === dateString;
                return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => field.handleChange(dateString), disabled: isLoading, className: `flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${isSelected ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20" : "border-input hover:border-purple-300 hover:bg-accent"} ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground mb-1", children: monthLabel }),
                  /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: dayLabel })
                ] }, dayOffset);
              }) }),
              field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
            ] }) }),
            /* @__PURE__ */ jsx(form.Field, { name: "delivery_time", validators: {
              onChange: ({
                value
              }) => {
                if (!value) return "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438";
                return void 0;
              }
            }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: field.name, children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 inline mr-2" }),
                "\u0412\u0440\u0435\u043C\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 *"
              ] }),
              /* @__PURE__ */ jsxs("select", { id: field.name, name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), disabled: isLoading, className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F" }),
                /* @__PURE__ */ jsx("option", { value: "07:00", children: "07:00 - 08:00" }),
                /* @__PURE__ */ jsx("option", { value: "08:00", children: "08:00 - 09:00" }),
                /* @__PURE__ */ jsx("option", { value: "09:00", children: "09:00 - 10:00" }),
                /* @__PURE__ */ jsx("option", { value: "10:00", children: "10:00 - 11:00" }),
                /* @__PURE__ */ jsx("option", { value: "11:00", children: "11:00 - 12:00" }),
                /* @__PURE__ */ jsx("option", { value: "12:00", children: "12:00 - 13:00" }),
                /* @__PURE__ */ jsx("option", { value: "13:00", children: "13:00 - 14:00" }),
                /* @__PURE__ */ jsx("option", { value: "14:00", children: "14:00 - 15:00" }),
                /* @__PURE__ */ jsx("option", { value: "15:00", children: "15:00 - 16:00" }),
                /* @__PURE__ */ jsx("option", { value: "16:00", children: "16:00 - 17:00" }),
                /* @__PURE__ */ jsx("option", { value: "17:00", children: "17:00 - 18:00" })
              ] }),
              field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
            ] }) }),
            /* @__PURE__ */ jsx(form.Field, { name: "notes", children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u0437\u0430\u043A\u0430\u0437\u0443" }),
              /* @__PURE__ */ jsx("textarea", { id: field.name, name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), placeholder: "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u0436\u0435\u043B\u0430\u043D\u0438\u044F \u0438\u043B\u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u0438...", disabled: isLoading, className: "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-base", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }),
                "\u0421\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B *"
              ] }) }),
              /* @__PURE__ */ jsx(form.Field, { name: "payment_method", validators: {
                onChange: ({
                  value
                }) => {
                  if (!value) return "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B";
                  return void 0;
                }
              }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${field.state.value === "cash" ? "border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20" : "border-input hover:border-purple-300"}`, children: [
                  /* @__PURE__ */ jsx("input", { type: "radio", name: field.name, value: "cash", checked: field.state.value === "cash", onChange: (e) => field.handleChange(e.target.value), className: "mt-1" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F4B5}" }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "\u041D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u043F\u0440\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435 \u0437\u0430\u043A\u0430\u0437\u0430" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${field.state.value === "card" ? "border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20" : "border-input hover:border-purple-300"}`, children: [
                  /* @__PURE__ */ jsx("input", { type: "radio", name: field.name, value: "card", checked: field.state.value === "card", onChange: (e) => field.handleChange(e.target.value), className: "mt-1" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F4B3}" }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "\u041A\u0430\u0440\u0442\u043E\u0439 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "\u041E\u043D\u043B\u0430\u0439\u043D \u043E\u043F\u043B\u0430\u0442\u0430 \u0431\u0430\u043D\u043A\u043E\u0432\u0441\u043A\u043E\u0439 \u043A\u0430\u0440\u0442\u043E\u0439 (Visa, Mastercard)" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${field.state.value === "kaspi" ? "border-purple-500 bg-purple-500/5 ring-2 ring-purple-500/20" : "border-input hover:border-purple-300"}`, children: [
                  /* @__PURE__ */ jsx("input", { type: "radio", name: field.name, value: "kaspi", checked: field.state.value === "kaspi", onChange: (e) => field.handleChange(e.target.value), className: "mt-1" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "\u{1F534}" }),
                      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Kaspi.kz" })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 Kaspi QR \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434 \u043D\u0430 \u043D\u043E\u043C\u0435\u0440" })
                  ] })
                ] }),
                field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsx(form.Subscribe, { selector: (state) => [state.canSubmit, state.isSubmitting], children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ jsx(GradientButton, { type: "submit", disabled: !canSubmit || isLoading || items.length === 0, variant: "gradient", size: "lg", className: "w-full", decorative: true, children: isLoading ? "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435..." : `\u041E\u0444\u043E\u0440\u043C\u0438\u0442\u044C \u0437\u0430\u043A\u0430\u0437 \u043D\u0430 ${totalPrice} \u20B8` }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-6 sticky top-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-4", children: "\u0412\u0430\u0448 \u0437\u0430\u043A\u0430\u0437" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-4", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: item.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
              item.quantity,
              " \xD7 ",
              item.price,
              " \u20B8"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
            item.quantity * item.price,
            " \u20B8"
          ] })
        ] }, item.id)) }),
        /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "\u0422\u043E\u0432\u0430\u0440\u043E\u0432:" }),
            /* @__PURE__ */ jsx("span", { children: items.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-lg font-bold", children: [
            /* @__PURE__ */ jsx("span", { children: "\u0418\u0442\u043E\u0433\u043E:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-foreground", children: [
              totalPrice,
              " \u20B8"
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=checkout-DnUfZpLX.mjs.map
