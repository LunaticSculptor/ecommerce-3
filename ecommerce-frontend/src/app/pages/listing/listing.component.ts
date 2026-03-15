import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-listing',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ProductCardComponent, SkeletonLoaderComponent],
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    loading = true;
    totalElements = 0;

    filterForm: FormGroup;

    page = 1;
    pageSize = 10;
    hasMore = true;

    private destroy$ = new Subject<void>();

    sortOptions = [
        { value: '', label: 'Featured' },
        { value: 'newest', label: 'Newest Arrivals' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Avg. Customer Review' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private productService: ProductService
    ) {
        this.filterForm = this.fb.group({
            q: [''],
            minPrice: [null],
            maxPrice: [null],
            rating: [null],
            sort: ['']
        });
    }

    ngOnInit(): void {
        // Sync URL -> Form
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.filterForm.patchValue({
                q: params['q'] || '',
                minPrice: params['minPrice'] ? Number(params['minPrice']) : null,
                maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : null,
                rating: params['rating'] ? Number(params['rating']) : null,
                sort: params['sort'] || ''
            }, { emitEvent: false }); // Avoid infinite loop

            this.page = 1;
            this.products = [];
            this.loadProducts();
        });

        // Sync Form -> URL
        this.filterForm.valueChanges.pipe(
            debounceTime(500),
            takeUntil(this.destroy$)
        ).subscribe(values => {
            const queryParams: any = {};
            if (values.q) queryParams.q = values.q;
            if (values.minPrice) queryParams.minPrice = values.minPrice;
            if (values.maxPrice) queryParams.maxPrice = values.maxPrice;
            if (values.rating) queryParams.rating = values.rating;
            if (values.sort) queryParams.sort = values.sort;

            this.router.navigate([], {
                relativeTo: this.route,
                queryParams,
                replaceUrl: true
            });
        });
    }

    loadProducts(): void {
        this.loading = true;
        const vals = this.filterForm.value;

        const searchReq = {
            query: vals.q,
            price: (vals.minPrice != null || vals.maxPrice != null) ? {
                min: vals.minPrice || 0,
                max: vals.maxPrice || 999999
            } : null,
            rating: vals.rating,
            sort: vals.sort,
            page: this.page,
            pageSize: this.pageSize
        };

        // If there is a category param in the URL, the search endpoint will handle it via text match for now (mocked).
        // In a real app we'd add category to SearchRequest.
        const categoryParam = this.route.snapshot.queryParams['category'];
        if (categoryParam && !vals.q) {
            searchReq.query = categoryParam; // Mock query fallback
        }

        this.productService.searchProducts(searchReq).subscribe({
            next: (res) => {
                if (this.page === 1) {
                    this.products = res.content;
                } else {
                    this.products = [...this.products, ...res.content];
                }
                this.totalElements = res.totalElements;
                this.hasMore = !res.last;
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    loadMore(): void {
        if (!this.loading && this.hasMore) {
            this.page++;
            this.loadProducts();
        }
    }

    clearFilters(): void {
        this.filterForm.reset();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
