export interface Category {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    category: number;
    category_name: string;
    price: string;
    image: string | null;
    is_available: boolean;
    weight: number;
    ingredients: string;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id?: number;
    name: string;
    phone: string;
    email?: string;
    address: string;
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    price: string;
}

export interface CreateOrderData {
    customer: Customer | { id: number };
    items: OrderItem[];
    delivery_date: string;
    payment_method?: string;
    notes?: string;
}

export interface Order {
    id: number;
    customer: number;
    customer_name: string;
    status: string;
    total_amount: string;
    delivery_date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    items: Array<{
        id: number;
        product: number;
        product_name: string;
        quantity: number;
        price: string;
        total_price: number;
    }>;
}