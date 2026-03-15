import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerService } from '../../services/banner.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Banner, Category, Product } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, ProductCardComponent, SkeletonLoaderComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    banners: Banner[] = [];
    categories: Category[] = [];
    featuredProducts: Product[] = [];

    loadingBanners = true;
    loadingCategories = true;
    loadingProducts = true;

    constructor(
        private bannerService: BannerService,
        private categoryService: CategoryService,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.bannerService.getBanners().pipe(
            finalize(() => this.loadingBanners = false)
        ).subscribe(data => this.banners = data);

        this.categoryService.getCategories().pipe(
            finalize(() => this.loadingCategories = false)
        ).subscribe(data => this.categories = data);

        this.productService.getProducts(true, '', 0, 8).pipe( // limit=8 featured
            finalize(() => this.loadingProducts = false)
        ).subscribe(res => {
            this.featuredProducts = res.content;
        });
    }
}
