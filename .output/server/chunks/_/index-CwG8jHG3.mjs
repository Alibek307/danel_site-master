import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { a as useAuthStore, p as profileApi, B as Button, c as cn } from './ssr.mjs';
import { u as useForm, L as Label } from './useForm-CSs12aQO.mjs';
import { useMutation } from '@tanstack/react-query';
import { I as Input } from './input-CXqKeBqH.mjs';
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from './card-CvYRv4d7.mjs';
import { User, MapPin, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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
import '@radix-ui/react-label';

function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[80px] w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function ChangePasswordForm() {
  const [isChanging, setIsChanging] = useState(false);
  const changePasswordMutation = useMutation({
    mutationFn: (data) => profileApi.changePassword(data),
    onSuccess: () => {
      toast.success("\u041F\u0430\u0440\u043E\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0435\u043D!");
      setIsChanging(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u043F\u0430\u0440\u043E\u043B\u044F");
    }
  });
  const form = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirm: ""
    },
    onSubmit: async ({
      value
    }) => {
      changePasswordMutation.mutate(value);
    }
  });
  if (!isChanging) {
    return /* @__PURE__ */ jsxs(Button, { onClick: () => setIsChanging(true), variant: "outline", className: "w-full", children: [
      /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 mr-2" }),
      "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C"
    ] });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }, className: "space-y-4", children: [
    /* @__PURE__ */ jsx(form.Field, { name: "old_password", validators: {
      onChange: ({
        value
      }) => !value ? "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" : void 0
    }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" }),
      /* @__PURE__ */ jsx(Input, { id: field.name, name: field.name, type: "password", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043F\u0430\u0440\u043E\u043B\u044C", disabled: changePasswordMutation.isPending }),
      field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
    ] }) }),
    /* @__PURE__ */ jsx(form.Field, { name: "new_password", validators: {
      onChange: ({
        value
      }) => !value ? "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" : value.length < 8 ? "\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432" : void 0
    }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" }),
      /* @__PURE__ */ jsx(Input, { id: field.name, name: field.name, type: "password", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), placeholder: "\u041C\u0438\u043D\u0438\u043C\u0443\u043C 8 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432", disabled: changePasswordMutation.isPending }),
      field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
    ] }) }),
    /* @__PURE__ */ jsx(form.Field, { name: "new_password_confirm", validators: {
      onChange: ({
        value,
        fieldApi
      }) => {
        const newPassword = fieldApi.form.getFieldValue("new_password");
        return !value ? "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" : value !== newPassword ? "\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442" : void 0;
      }
    }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" }),
      /* @__PURE__ */ jsx(Input, { id: field.name, name: field.name, type: "password", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), placeholder: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C", disabled: changePasswordMutation.isPending }),
      field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
      /* @__PURE__ */ jsx(form.Subscribe, { selector: (state) => [state.canSubmit, state.isSubmitting], children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ jsx(Button, { type: "submit", disabled: !canSubmit || changePasswordMutation.isPending, className: "flex-1", children: changePasswordMutation.isPending ? "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C" }) }),
      /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => {
        setIsChanging(false);
        form.reset();
      }, disabled: changePasswordMutation.isPending, className: "flex-1", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
    ] })
  ] });
}
const SplitComponent = function ProfilePage() {
  const {
    user,
    updateUser
  } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileApi.update(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      toast.success("\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0444\u0438\u043B\u044F");
    }
  });
  const form = useForm({
    defaultValues: {
      name: (user == null ? void 0 : user.name) || "",
      address: (user == null ? void 0 : user.address) || ""
    },
    onSubmit: async ({
      value
    }) => {
      updateProfileMutation.mutate(value);
    }
  });
  if (!user) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(User, { className: "w-8 h-8" }),
      "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "\u041B\u0438\u0447\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0438\u043C\u044F \u0438 \u0430\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-6", children: !isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(User, { className: "w-5 h-5 mt-0.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "\u0418\u043C\u044F" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: user.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 mt-0.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "\u0410\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: user.address })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 mt-0.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Email" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: user.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5 mt-0.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }),
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: user.phone })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: () => setIsEditing(true), className: "w-full", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C" })
        ] }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsx(form.Field, { name: "name", validators: {
            onChange: ({
              value
            }) => !value || value.trim().length === 0 ? "\u0418\u043C\u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E" : void 0
          }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u0418\u043C\u044F" }),
            /* @__PURE__ */ jsx(Input, { id: field.name, name: field.name, type: "text", value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), placeholder: "\u0412\u0430\u0448\u0435 \u0438\u043C\u044F", disabled: updateProfileMutation.isPending }),
            field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
          ] }) }),
          /* @__PURE__ */ jsx(form.Field, { name: "address", validators: {
            onChange: ({
              value
            }) => !value || value.trim().length === 0 ? "\u0410\u0434\u0440\u0435\u0441 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" : void 0
          }, children: (field) => /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: field.name, children: "\u0410\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438" }),
            /* @__PURE__ */ jsx(Textarea, { id: field.name, name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value), placeholder: "\u0412\u0430\u0448 \u0430\u0434\u0440\u0435\u0441 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438", disabled: updateProfileMutation.isPending, rows: 3 }),
            field.state.meta.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive", children: field.state.meta.errors[0] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Email (\u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F)" }),
              /* @__PURE__ */ jsx(Input, { value: user.email, disabled: true, className: "mt-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D (\u043D\u0435 \u0438\u0437\u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F)" }),
              /* @__PURE__ */ jsx(Input, { value: user.phone, disabled: true, className: "mt-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
            /* @__PURE__ */ jsx(form.Subscribe, { selector: (state) => [state.canSubmit, state.isSubmitting], children: ([canSubmit, isSubmitting]) => /* @__PURE__ */ jsx(Button, { type: "submit", disabled: !canSubmit || updateProfileMutation.isPending, className: "flex-1", children: updateProfileMutation.isPending ? "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435..." : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F" }) }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => {
              setIsEditing(false);
              form.reset();
            }, disabled: updateProfileMutation.isPending, className: "flex-1", children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "\u0414\u043B\u044F \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043D\u0430\u0434\u0435\u0436\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(ChangePasswordForm, {}) })
      ] })
    ] })
  ] }) });
};

export { SplitComponent as component };
//# sourceMappingURL=index-CwG8jHG3.mjs.map
