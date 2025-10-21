import { log } from "console";
import { useAuthStore } from "../stores/useAuthStore";

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const tokens = useAuthStore((state) => state.tokens);
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const logout = useAuthStore((state) => state.logout);

    const isAuthenticated = !!tokens?.access && !!user;

    return {
        user,
        tokens,
        isAuthenticated,
        login,
        register,
        logout,
    };
};

export const useIsAuthenticated = () => {
    const tokens = useAuthStore((state) => state.tokens);
    const user = useAuthStore((state) => state.user);
    return !!tokens?.access && !!user;
};