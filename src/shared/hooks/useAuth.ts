import { useAuthStore } from "../stores/useAuthStore";

export const useAuth = () => {
    return useAuthStore((state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        login: state.login,
        register: state.register,
        logout: state.logout,
    }));
};

export const useIsAuthenticated = () => {
    return useAuthStore((state) => state.isAuthenticated);
};

export const useUser = () => {
    return useAuthStore((state) => state.user);
};