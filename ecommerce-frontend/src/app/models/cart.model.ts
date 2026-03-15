import { Product } from './product.model';

export interface CartItem {
    product: Product;
    quantity: number;
    selectedColor: string;
    priceAtPurchase: number;
}

export interface CartSummary {
    subtotal: number;
    discount: number;
    deliveryCharges: number;
    totalAmount: number;
}
