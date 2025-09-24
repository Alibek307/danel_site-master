export interface User {
    id: number;
    company_name: string;
    phone: string;
    email: string;
    address: string;
    is_active: boolean;
    last_login: string | null;
    created_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    company_name: string;
    phone: string;
    email: string;
    password: string;
    address: string;
}

export interface AuthResponse {
    customer: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface RefreshTokenResponse {
    access: string;
}