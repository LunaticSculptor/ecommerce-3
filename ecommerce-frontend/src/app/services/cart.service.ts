import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private itemsSubject = new BehaviorSubject<CartItem[]>([]);
    public items$ = this.itemsSubject.asObservable();

    private summarySubject = new BehaviorSubject<CartSummary>({ subtotal: 0, discount: 0, deliveryCharges: 0, totalAmount: 0 });
    public summary$ = this.summarySubject.asObservable();

    constructor() {
        this.calculateSummary();
    }

    getItems(): CartItem[] {
        return this.itemsSubject.value;
    }

    addToCart(item: CartItem): void {
        const currentItems = this.getItems();
        const existingIndex = currentItems.findIndex(i => i.product.id === item.product.id && i.selectedColor === item.selectedColor);

        if (existingIndex > -1) {
            currentItems[existingIndex].quantity += item.quantity;
            currentItems[existingIndex].priceAtPurchase = item.priceAtPurchase;
        } else {
            currentItems.push(item);
        }

        this.itemsSubject.next([...currentItems]);
        this.calculateSummary();
    }

    updateQuantity(productId: number, color: string, quantity: number): void {
        const currentItems = this.getItems();
        const item = currentItems.find(i => i.product.id === productId && i.selectedColor === color);
        if (item && quantity > 0) {
            item.quantity = quantity;
            this.itemsSubject.next([...currentItems]);
            this.calculateSummary();
        }
    }

    removeItem(productId: number, color: string): void {
        const currentItems = this.getItems().filter(i => !(i.product.id === productId && i.selectedColor === color));
        this.itemsSubject.next(currentItems);
        this.calculateSummary();
    }

    clearCart(): void {
        this.itemsSubject.next([]);
        this.calculateSummary();
    }

    private calculateSummary(): void {
        const items = this.getItems();
        let subtotal = 0;

        items.forEach(item => {
            subtotal += item.priceAtPurchase * item.quantity;
        });

        const discount = subtotal > 1000 ? subtotal * 0.1 : 0; // 10% discount on carts over 1000 (mock logic)
        const deliveryCharges = subtotal > 500 ? 0 : 50; // Free delivery over 500
        const totalAmount = subtotal - discount + deliveryCharges;

        this.summarySubject.next({
            subtotal,
            discount,
            deliveryCharges,
            totalAmount
        });
    }
}
