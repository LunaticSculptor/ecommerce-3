import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    currentStep = 1; // 1: Login, 2: Address, 3: Summary

    cartItems: any[] = [];
    cartSummary: any = null;

    addressForm: FormGroup;
    isSubmitting = false;
    errorMsg = '';

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private cartService: CartService,
        private orderService: OrderService,
        public authService: AuthService,
        private router: Router
    ) {
        this.addressForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            zipCode: ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    ngOnInit(): void {
        this.cartService.items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
            this.cartItems = items;
            if (items.length === 0 && this.currentStep === 3) {
                this.router.navigate(['/cart']);
            }
        });

        this.cartService.summary$.pipe(takeUntil(this.destroy$)).subscribe(summary => {
            this.cartSummary = summary;
        });

        this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            if (user) {
                this.addressForm.patchValue({
                    email: user.email,
                    fullName: user.name || ''
                });
                if (this.currentStep === 1) {
                    this.currentStep = 2; // Auto advance if logged in
                }
            }
        });
    }

    nextStep() {
        if (this.currentStep === 1) {
            if (!this.authService.isLoggedIn()) {
                // Can optionally allow guest checkout, we will just patch dummy values or require login.
                // Spec says "Enter your details"
            }
            this.currentStep = 2;
        } else if (this.currentStep === 2) {
            if (this.addressForm.valid) {
                this.currentStep = 3;
            } else {
                this.addressForm.markAllAsTouched();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    placeOrder() {
        if (this.addressForm.invalid || this.cartItems.length === 0) return;

        this.isSubmitting = true;
        this.errorMsg = '';

        const vals = this.addressForm.value;
        const orderRequest = {
            customerEmail: vals.email,
            customerName: vals.fullName,
            deliveryAddress: `${vals.address}, ${vals.city}, ${vals.zipCode}`,
            subtotal: this.cartSummary.subtotal,
            discount: this.cartSummary.discount,
            deliveryCharges: this.cartSummary.deliveryCharges,
            totalAmount: this.cartSummary.totalAmount,
            paymentMethod: 'CASH_ON_DELIVERY',
            items: this.cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                price: item.priceAtPurchase
            }))
        };

        this.orderService.placeOrder(orderRequest).subscribe({
            next: (res) => {
                this.cartService.clearCart();
                this.isSubmitting = false;
                this.router.navigate(['/order-success', res.id]);
            },
            error: () => {
                this.isSubmitting = false;
                this.errorMsg = 'Failed to place order. Please try again.';
            }
        });
    }

    loginAsMock() {
        this.authService.login({ email: 'test@gmail.com', password: '123' }).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
