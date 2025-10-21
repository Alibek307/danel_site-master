const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
import { useAuthStore } from "../stores/useAuthStore";

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const tokens = useAuthStore.getState().tokens;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...(tokens?.access && {
                    Authorization: `Bearer ${tokens.access}`,
                }),
                ...options.headers,
            },
            ...options,
        });

        if (response.status == 401 && tokens?.refresh) {
            try {
                const refreshResponse = await fetch(`${this.baseURL}/auth/refresh/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: tokens.refresh }),
                });

                if (!refreshResponse.ok) {
                    throw new Error('Refresh failed');
                }

                const refreshData = await refreshResponse.json();

                useAuthStore.setState({
                    tokens: {
                        access: refreshData.access,
                        refresh: tokens.refresh,
                    },
                });

                const retryResponse = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${refreshData.access}`,
                        ...options.headers,
                    },
                });

                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }

                return retryResponse.json();
            } catch {
                useAuthStore.getState().logout();
                throw new Error('Сессия истекла');
            }
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint);
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    
    async patch<T>(endpoint: string, data: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new ApiClient();
