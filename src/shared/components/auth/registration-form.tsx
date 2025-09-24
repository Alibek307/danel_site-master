import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Button } from '../shadcn/button';
import { Input } from '../shadcn/input';
import { Label } from '../shadcn/label';
import { toast } from 'sonner';

export function RegistrationFrom() {
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuthStore();
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            company_name: '',
            phone: '',
            email: '',
            password: '',
            password_confirm: '',
            address: '',
        },
        onSubmit: async ({ value }) => {
            if (value.password !== value.password_confirm) {
                toast.error('Пароли не совпадают');
                return;
            }

            setIsLoading(true);
            try {
                await register(value);
                toast.success('Регистрация прошла успешно!');
                router.navigate({ to: '/' });
            } catch (error: any) {
                toast.error(error.message || 'Ошибка регистрации');
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
            <div className='space-y-6'>
                <form.Field 
                    name="company_name"
                    validators={{
                        onChange: ({ value }) =>
                            !value
                                ? 'Название компании обязательно'
                                : value.length < 2
                                ? 'Название должно содержать минимум 2 символа'
                                : undefined,  
                    }}
                >
                    {(field) => (
                        <div className='space-y-2'>
                            <Label htmlFor={field.name}>Название компании</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder='Моя компания'
                                disabled={isLoading}
                                aria-invalid={!!field.state.meta.errors.length}
                            />
                            {field.state.meta.errors && (
                                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field 
                    name="phone"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'Телефон обязателен' : undefined, 
                    }}
                >
                    {(field) => (
                        <div className='space-y-2'>
                            <Label htmlFor={field.name}>Телефон</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="tel"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder='+7'
                                disabled={isLoading}
                                aria-invalid={!!field.state.meta.errors.length}
                            />
                            {field.state.meta.errors && (
                                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                            )}
                        </div>
                    )}
                </form.Field>
                
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
                                name={field.name}
                                type="email"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder='your@email.com'
                                disabled={isLoading}
                                aria-invalid={!!field.state.meta.errors.length}
                            />
                            {field.state.meta.errors && (
                                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
                                : value.length < 8
                                ? 'Пароль должен содержать минимум 8 символов'
                                : undefined,  
                    }}
                >
                    {(field) => (
                        <div className='space-y-2'>
                            <Label htmlFor={field.name}>Пароль</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                aria-invalid={!!field.state.meta.errors.length}
                            />
                            {field.state.meta.errors && (
                                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field 
                    name="password_confirm"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'Подтвердите пароль' : undefined,
                    }}
                >
                    {(field) => (
                        <div className='space-y-2'>
                            <Label htmlFor={field.name}>Повторите пароль</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="••••••••"
                                disabled={isLoading}
                                aria-invalid={!!field.state.meta.errors.length}
                            />
                            {field.state.meta.errors && (
                                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field 
                    name="address"
                    validators={{
                        onChange: ({ value }) =>
                            !value ? 'Адрес обязателен' : undefined,
                    }}
                >
                    {(field) => (
                        <div className='space-y-2'>
                            <Label htmlFor={field.name}>Адрес</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="г. Алматы, ул. Абая 123"
                                disabled={isLoading}
                                aria-invalid={!!field.state.meta.errors.length}
                            />
                            {field.state.meta.errors && (
                                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
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
                            {isLoading ? 'Регистрция...' : 'Зарегистрироваться'}
                        </Button>
                    )}
            </form.Subscribe>

            <div className='text-center text-sm text-muted-foreground'>
                Уже есть аккаунт?{' '}
                <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.navigate({ to: '/auth/login' })}
                >
                    Войти
                </Button>
            </div>
        </form>
    );
}