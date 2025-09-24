import { useState } from 'react';
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router"
import { useAuthStore } from "../../shared/stores/useAuthStore";
import { Button } from '../../shared/components/shadcn/button';
import { Input } from '../../shared/components/shadcn/input';
import { Label } from '../../shared/components/shadcn/label';
import { toast } from 'sonner';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        await login(value.email, value.password);
        toast.success('Успешный вход в систему!');
        router.navigate({ to: '/'});
      } catch (error: any) {
        toast.error(error.message || 'Ошибка входа в систему');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className='space-y-4'>
        <form.Field 
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Email обязателен'
                : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? 'Неверный формат email'
                : undefined,
          }}
        >
          {(field) => (
            <div className='space-y-2'>
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                type="email"
                placeholder="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isLoading}
                aria-invalid={!!field.state.meta.errors.length}
              />
              {field.state.meta.errors && (
                <p className='text-sm text-destructive'>{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field 
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Пароль обязателен'
                : value.length < 6
                ? 'Пароль должен содержать минимум 6 символов'
                : undefined,
          }}
        >
          {(field) => (
            <div className='space-y-2'>
              <Label htmlFor={field.name}>Пароль</Label>
              <Input
                id={field.name}
                type="password"
                placeholder="••••••••"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isLoading}
                aria-invalid={!!field.state.meta.errors.length}
              />
              {field.state.meta.errors && (
                <p className='text-sm text-destructive'>{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        )}
      </form.Subscribe>

      <div className="text-center text-sm text-muted-foreground">
        Нет аккаунта?{' '}
        <Button
          type="button"
          variant="link"
          className='p-0 h-auto'
          onClick={() => router.navigate({ to: '/auth/register'})}
        >
          Зарегистрироваться
        </Button>
      </div>
    </form>
  );
};