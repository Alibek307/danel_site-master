import { jsx, jsxs } from 'react/jsx-runtime';
import { u as useForm, L as Label } from './useForm-CSs12aQO.mjs';
import { a as useAuthStore, B as Button } from './ssr.mjs';
import { I as Input } from './input-CXqKeBqH.mjs';
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import '@radix-ui/react-label';
import '@tanstack/react-query';
import 'zustand';
import 'zustand/middleware';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'lucide-react';
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

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        await login(value.email, value.password);
        toast.success("\u0423\u0441\u043F\u0435\u0448\u043D\u044B\u0439 \u0432\u0445\u043E\u0434 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443!");
        router.navigate({ to: "/" });
      } catch (error) {
        toast.error(error.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0445\u043E\u0434\u0430 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0443");
      } finally {
        setIsLoading(false);
      }
    }
  });
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      },
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "email",
              validators: {
                onChange: ({ value }) => !value ? "Email \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 email" : void 0
              },
              children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "Email" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: field.name,
                    name: field.name,
                    type: "email",
                    value: field.state.value,
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                    placeholder: "your@email.com",
                    disabled: isLoading,
                    "aria-invalid": !!field.state.meta.errors.length
                  }
                ),
                field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "password",
              validators: {
                onChange: ({ value }) => !value ? "\u041F\u0430\u0440\u043E\u043B\u044C \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" : value.length < 6 ? "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" : void 0
              },
              children: (field) => /* @__PURE__ */ jsxs("div", { className: "space", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u041F\u0430\u0440\u043E\u043B\u044C" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: field.name,
                    name: field.name,
                    type: "password",
                    value: field.state.value,
                    onBlur: field.handleBlur,
                    onChange: (e) => field.handleChange(e.target.value),
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                    disabled: isLoading,
                    "aria-invalid": !!field.state.meta.errors.length
                  }
                ),
                field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          form.Subscribe,
          {
            selector: (state) => [state.canSubmit, state.isSubmitting],
            children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                disabled: !canSubmit || isLoading,
                className: "w-full",
                size: "lg",
                children: isLoading ? "\u0412\u0445\u043E\u0434..." : "\u0412\u043E\u0439\u0442\u0438"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
          "\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?",
          " ",
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "link",
              className: "p-0 h-auto",
              onClick: () => router.navigate({ to: "/auth/register" }),
              children: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F"
            }
          )
        ] })
      ]
    }
  );
}
const SplitComponent = function LoginPage() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "max-w-md w-full mx-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "\u0412\u0445\u043E\u0434" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u0441\u0432\u043E\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442" })
    ] }),
    /* @__PURE__ */ jsx(LoginForm, {})
  ] }) }) });
};

export { SplitComponent as component };
//# sourceMappingURL=login-CnqlFynv.mjs.map
