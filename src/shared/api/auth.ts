import { apiClient } from './clients';
import type { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenResponse } from '../types/auth';

export const authApi = {
    login: (data: LoginRequest): Promise<AuthResponse> =>
        apiClient.post('/auth/login/', data),

    register: (data: RegisterRequest): Promise<AuthResponse> =>
        apiClient.post('/auth/register/', data),

    refresh: (refreshToken: string): Promise<RefreshTokenResponse> =>
        apiClient.post('/auth/refresh/', { refresh: refreshToken }),
};
