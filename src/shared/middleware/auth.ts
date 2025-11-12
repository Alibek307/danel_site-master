import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';

export const requireAuth = ({ location }: {location: { href: string } }) => {
    const authStore = useAuthStore.getState();

    if (!authStore.tokens?.access || !authStore.user) {
        throw redirect({
            to: '/auth/login',
            search: {
                redirect: location.href,
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