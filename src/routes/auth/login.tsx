import { createFileRoute } from '@tanstack/react-router';
import { requireGuest } from '../../shared/middleware/auth';
import { LoginForm } from '../../shared/components/auth/login-form';

export const Route = createFileRoute('/auth/login')({
  beforeLoad: requireGuest,
  component: LoginPage,
});

function LoginPage() {
  return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-4">
              <div className='space-y-6'>
                <div className='text-center'>
                  <h1 className="text-3xl font-bold tracking-tight">Вход</h1>
                  <p className='text-muted-foreground mt-2'>
                    Войдите в свой аккаунт
                  </p>
                </div>
                <LoginForm />
              </div>
            </div>
        </div>
    );
}
