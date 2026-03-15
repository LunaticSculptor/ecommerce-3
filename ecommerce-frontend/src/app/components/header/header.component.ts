import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    cartItemCount = 0;
    isLoggedIn = false;
    userEmail = '';

    searchControl = new FormControl('');
    searchResults: any[] = [];
    showDropdown = false;

    private destroy$ = new Subject<void>();

    constructor(
        private cartService: CartService,
        private authService: AuthService,
        private productService: ProductService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartService.items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
            this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
        });

        this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            this.isLoggedIn = !!user;
            this.userEmail = user ? user.email : '';
        });

        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap(query => {
                    if (!query || query.length < 2) {
                        this.searchResults = [];
                        this.showDropdown = false;
                        return [];
                    }
                    return this.productService.searchProducts({ query, page: 1, pageSize: 5 });
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((res: any) => {
                if (res && res.content) {
                    this.searchResults = res.content;
                    this.showDropdown = this.searchResults.length > 0;
                }
            });
    }

    onSearchSubmit() {
        const query = this.searchControl.value;
        if (query) {
            this.showDropdown = false;
            this.router.navigate(['/products'], { queryParams: { q: query } });
        }
    }

    goToProduct(id: number) {
        this.showDropdown = false;
        this.searchControl.setValue('');
        this.router.navigate(['/products', id]);
    }

    logout() {
        this.authService.logout();
    }

    loginMock() {
        this.authService.login({ email: 'test@gmail.com', password: '123' }).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
