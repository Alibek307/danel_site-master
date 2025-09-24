import { User, LogOut, Settings } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button,
    Avatar,
} from '../shadcn';

export function ProfileMenu() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    if (!isAuthenticated) {
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.navigate({ to: '/auth/login'})}
                className="gap-2"
            >
                <User className='w-4 h-4' />
                <span className='hidden sm:inline'>Войти</span>
            </Button>
        );
    }

    const handleLogout = () => {
        logout();
        router.navigate({ to: '/'});
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-6 h-6">
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3 h-3" />
                        </div>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4} className="w-56">
                <div className='px-2 py-1.5'>
                    <p className='text-sm font-medium'>{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.navigate({ to: '/profile' })}>
                    <Settings className="w-4 h-4 mr-2" />
                    Профиль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}