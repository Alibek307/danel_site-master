import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/shared/api/services";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import { Label } from "@/shared/components/shadcn/label";
import { Textarea } from "@/shared/components/shadcn/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/shadcn/card";
import { User, MapPin, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Lock } from "lucide-react"; 

export const Route = createFileRoute('/profile/')({
  beforeLoad: ({ location }) => {
    const authStore = useAuthStore.getState();

    if (!authStore.tokens?.access || !authStore.user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: ProfilePage,
});

function ChangePasswordForm() {
  const [isChanging, setIsChanging] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (data: { old_password: string; new_password: string; new_password_confirm: string }) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Пароль успешно изменен!');
      setIsChanging(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка при изменения пароля');
    },
  });

  const form = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password_confirm: '',
    },
    onSubmit: async ({ value }) => {
      changePasswordMutation.mutate(value);
    },
  });

  if (!isChanging) {
    return (
      <Button onClick={() => setIsChanging(true)} variant="outline" className="w-full">
        <Lock className="w-4 h-4 mr-2" />
        Изменить пароль
      </Button>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="old_password"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Введите текущий пароль' : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Текущий пароль</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Введите текущий пароль"
              disabled={changePasswordMutation.isPending}
            />
            {field.state.meta.errors && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="new_password"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Введите новый пароль'
              : value.length < 8
              ? 'Пароль должен содержать минимум 8 символов'
              : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Новый пароль</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Минимум 8 символов"
              disabled={changePasswordMutation.isPending}
            />
            {field.state.meta.errors && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="new_password_confirm"
        validators={{
          onChange: ({ value, fieldApi }) => {
            const newPassword = fieldApi.form.getFieldValue('new_password');
            return !value
              ? 'Подтвердите новый пароль'
              : value !== newPassword
              ? 'Пароли не совпадают'
              : undefined;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Подтвердите новый пароль</Label>
            <Input
              id={field.name}
              name={field.name}
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Повторите новый пароль"
              disabled={changePasswordMutation.isPending}
            />
            {field.state.meta.errors && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex gap-3 pt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || changePasswordMutation.isPending}
              className="flex-1"
            >
              {changePasswordMutation.isPending ? 'Изменение...' : 'Сохранить пароль'}
            </Button>
          )}
        </form.Subscribe>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsChanging(false);
            form.reset();
          }}
          disabled={changePasswordMutation.isPending}
          className="flex-1"
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}

function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; address?: string }) =>
      profileApi.update(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      toast.success('Профиль успешно обновлен!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Ошибка обновления профиля');
    },
  });

  const form = useForm({
    defaultValues: {
      name: user?.name || '',
      address: user?.address || '',
    },
    onSubmit: async ({ value }) => {
      updateProfileMutation.mutate(value);
    },
  });

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <User className="w-8 h-8" />
          Профиль пользователя
        </h1>

        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
              <CardDescription>
                Вы можете изменить имя и адрес доставки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isEditing ? (
                <>
                  {/* Режим просмотра */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Имя</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Адрес доставки</p>
                        <p className="font-medium">{user.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    Редактировать профиль
                  </Button>
                </>
              ) : (
                <>
                  {/* Режим редактирования */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="space-y-4"
                  >
                    <form.Field
                      name="name"
                      validators={{
                        onChange: ({ value }) =>
                          !value || value.trim().length === 0
                            ? 'Имя обязательно'
                            : undefined,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Имя</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Ваше имя"
                            disabled={updateProfileMutation.isPending}
                          />
                          {field.state.meta.errors && (
                            <p className="text-sm text-destructive">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field
                      name="address"
                      validators={{
                        onChange: ({ value }) =>
                          !value || value.trim().length === 0
                            ? 'Адрес обязателен'
                            : undefined,
                      }}
                    >
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Адрес доставки</Label>
                          <Textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Ваш адрес доставки"
                            disabled={updateProfileMutation.isPending}
                            rows={3}
                          />
                          {field.state.meta.errors && (
                            <p className="text-sm text-destructive">
                              {field.state.meta.errors[0]}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    {/* Информация только для чтения */}
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <Label>Email (не изменяется)</Label>
                        <Input value={user.email} disabled className="mt-2" />
                      </div>

                      <div>
                        <Label>Телефон (не изменяется)</Label>
                        <Input value={user.phone} disabled className="mt-2" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                      >
                        {([canSubmit, isSubmitting]) => (
                          <Button
                            type="submit"
                            disabled={!canSubmit || updateProfileMutation.isPending}
                            className="flex-1"
                          >
                            {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
                          </Button>
                        )}
                      </form.Subscribe>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          form.reset();
                        }}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1"
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
          {/* Изменение пароля */}
          <Card>
            <CardHeader>
              <CardTitle>Изменить пароль</CardTitle>
              <CardDescription>
                Для безопасности используйте надежный пароль
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}