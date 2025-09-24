import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '../api/services';
import type { Product } from '../types/api';
import type { ProductData } from '../components/common/pie-card';

export const useProducts = (categoryId?: number) => {
    return useQuery({
        queryKey: ['product', categoryId],
        queryFn: () => productsApi.getAll(categoryId ? { category: categoryId } : undefined),
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAll(),
    });
};

export const transformProduct = (product: Product): ProductData => ({
    id: product.id,
    name: product.name,
    image: product.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=faces',
    ingredients: product.ingredients ? product.ingredients.split(', ') : [],
    price: parseFloat(product.price),
});

