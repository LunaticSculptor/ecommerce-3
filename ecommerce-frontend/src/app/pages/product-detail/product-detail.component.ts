import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, SkeletonLoaderComponent, FormsModule],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
    product: Product | null = null;
    loading = true;
    error = false;

    mainImage = '';
    selectedColor = '';
    quantity = 1;

    showToast = false;
    toastMessage = '';

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const id = Number(params.get('id'));
            if (id) {
                this.loadProduct(id);
            }
        });
    }

    loadProduct(id: number): void {
        this.loading = true;
        this.error = false;
        this.productService.getProduct(id).subscribe({
            next: (res) => {
                this.product = res;
                this.mainImage = res.imageUrls && res.imageUrls.length > 0 ? res.imageUrls[0] : '';
                this.selectedColor = res.availableColors && res.availableColors.length > 0 ? res.availableColors[0] : '';
                this.quantity = 1;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.error = true;
            }
        });
    }

    setMainImage(url: string) {
        this.mainImage = url;
    }

    selectColor(color: string) {
        this.selectedColor = color;
    }

    increaseQuantity() {
        if (this.product && this.quantity < this.product.stockQuantity) {
            this.quantity++;
        }
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    addToCart() {
        if (!this.product) return;

        this.cartService.addToCart({
            product: this.product,
            quantity: this.quantity,
            selectedColor: this.selectedColor,
            priceAtPurchase: this.product.price
        });

        this.showSuccessFeedback('Added to cart successfully!');
    }

    buyNow() {
        if (!this.product) return;

        this.cartService.clearCart(); // Clear to only buy this one -- or just add it. Assuming direct checkout for "only this product".
        this.cartService.addToCart({
            product: this.product,
            quantity: this.quantity,
            selectedColor: this.selectedColor,
            priceAtPurchase: this.product.price
        });
        this.router.navigate(['/checkout']);
    }

    private showSuccessFeedback(msg: string) {
        this.toastMessage = msg;
        this.showToast = true;
        setTimeout(() => {
            this.showToast = false;
        }, 3000);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
