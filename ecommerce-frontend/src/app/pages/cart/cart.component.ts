import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CartItem, CartSummary } from '../../models/cart.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
    items: CartItem[] = [];
    summary: CartSummary | null = null;

    private destroy$ = new Subject<void>();

    constructor(public cartService: CartService) { }

    ngOnInit(): void {
        this.cartService.items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
            this.items = items;
        });

        this.cartService.summary$.pipe(takeUntil(this.destroy$)).subscribe(summary => {
            this.summary = summary;
        });
    }

    increaseQuantity(item: CartItem) {
        if (item.quantity < item.product.stockQuantity) {
            this.cartService.updateQuantity(item.product.id, item.selectedColor, item.quantity + 1);
        }
    }

    decreaseQuantity(item: CartItem) {
        if (item.quantity > 1) {
            this.cartService.updateQuantity(item.product.id, item.selectedColor, item.quantity - 1);
        }
    }

    removeItem(item: CartItem) {
        this.cartService.removeItem(item.product.id, item.selectedColor);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
