import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import type { User, RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

interface AuthStore {
    user: User | null;
    tokens: { access: string; refresh: string } | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            
            login: async (email: string, password: string) => {
                const response = await authApi.login({ email, password });

                set({
                    user: response.customer,
                    tokens: response.tokens,
                });

                // Zustand persist автоматически сохранит в localStorage
                // Ждем немного, чтобы persist middleware успел записать
                await new Promise(resolve => setTimeout(resolve, 50));
            },

            register: async (data: RegisterRequest) => {
                const response = await authApi.register(data);
                set({
                    user: response.customer,
                    tokens: response.tokens,
                });
            },

            logout: () => {
                set({ user: null, tokens: null });
            },

            updateUser: (user: User) => {
                set({ user });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);