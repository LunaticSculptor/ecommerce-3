import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="product-card" [routerLink]="['/products', product.id]">
      <div class="card-image-wrapper">
        <img [src]="product.imageUrls[0]" [alt]="product.name" class="product-image" loading="lazy">
        <div class="badges">
          <span class="badge badge-warning" *ngIf="product.originalPrice">Sale</span>
          <span class="badge" [ngClass]="product.inStock ? 'badge-success' : 'badge-danger'" *ngIf="!product.inStock">Out of Stock</span>
        </div>
      </div>
      
      <div class="card-content">
        <span class="product-category">{{product.category.name}}</span>
        <h3 class="product-title">{{product.name}}</h3>
        
        <div class="product-rating">
          <span class="stars">★ {{product.rating | number:'1.1-1'}}</span>
          <span class="reviews">({{product.reviewCount}})</span>
        </div>
        
        <div class="product-price-row">
          <span class="price">\${{product.price}}</span>
          <span class="original-price" *ngIf="product.originalPrice">\${{product.originalPrice}}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .product-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-normal);
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent-primary);
    }

    .card-image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 100%; /* 1:1 Aspect Ratio */
      overflow: hidden;
      background-color: #f3f4f6; /* placeholder color if image is transparent */
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-normal);
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .card-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-category {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .product-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .stars {
      color: var(--accent-warning);
      font-weight: 600;
    }
    
    .reviews {
      color: var(--text-secondary);
    }

    .product-price-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto; /* Push to bottom */
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .original-price {
      font-size: 0.875rem;
      color: var(--text-secondary);
      text-decoration: line-through;
    }
  `]
})
export class ProductCardComponent {
    @Input({ required: true }) product!: Product;
}
