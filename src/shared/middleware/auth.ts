import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';

export const requireAuth = () => {
    const authStore = useAuthStore.getState();

    if (!authStore.tokens?.access || !authStore.user) {
        throw redirect({
            to: '/auth/login',
            search: {
                redirect: window.location.href,
            },
        });
    }
};

export const requireGuest = () => {
    const authStore = useAuthStore.getState();

    if(authStore.tokens?.access && authStore.user) {
        throw redirect({
            to: '/',
        });
    }
};