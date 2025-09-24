import { createFileRoute } from "@tanstack/react-router";
import { RegistrationFrom } from "@/shared/components/auth/registration-form";
import { requireGuest } from "@/shared/middleware/auth";

export const Route = createFileRoute('/auth/register')({
    component: RegisterPage,
    beforeLoad: requireGuest,
});

function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-4">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Регистрация</h1>
                        <p className="text-muted-foreground mt-2">
                            Создайте аккаунт для оформления заказов
                        </p>
                    </div>
                    <RegistrationFrom />
                </div>
            </div>
        </div>
    );
}