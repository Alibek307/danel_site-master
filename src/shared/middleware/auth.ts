import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';

export const requireAuth = () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
        throw redirect({
            to: '/auth/login',
            search: {
                redirect: location.pathname,
            },
        });
    }
};

export const requireGuest = () => {
    const { isAuthenticated } = useAuthStore.getState();

    if(isAuthenticated) {
        throw redirect({
            to: '/',
        });
    }
};