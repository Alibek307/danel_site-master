import { apiClient } from "./clients";
import type { Category, Product, Order, CreateOrderData } from "../types/api";

export const categoriesApi = {
    getAll: () => apiClient.get<Category[]>('/categories/'),
    getById: (id: number) => apiClient.get<Category>(`/categories/${id}/`),
};

export const productsApi = {
    getAll: (params?: { category?: number }) => {
        const searchParams = new URLSearchParams();
        if(params?.category) {
            searchParams.append('category', params.category.toString());
        }
        const query = searchParams.toString() ? `?${searchParams}` : '';
        return apiClient.get<Product[]>(`/products/${query}`);
    },
    getById: (id: number) => apiClient.get<Product>(`/products/${id}/`),
};

export const ordersApi = {
    create: (data: CreateOrderData) =>
        apiClient.post<Order>('/orders/create_order/', data),
    getAll: () => apiClient.get<Order[]>('/orders/'),
    updateStatus: (id: number, status: string) =>
        apiClient.patch<Order>(`/orders/${id}/update_status/`, { status }),
};