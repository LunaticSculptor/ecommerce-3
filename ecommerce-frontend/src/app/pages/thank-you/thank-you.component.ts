import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-thank-you',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="thank-you-page container">
      <div class="success-card">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1 class="mt-4">Thank you, your order has been placed!</h1>
        <p class="text-secondary mt-2">
          Your order ID is <strong class="order-id">#{{orderId}}</strong>.
          We'll send you an email confirmation with tracking details shortly.
        </p>

        <div class="action-buttons mt-5">
          <button class="btn btn-primary" routerLink="/">Continue Shopping</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .thank-you-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 4rem 1rem;
    }

    .success-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 4rem 2rem;
      text-align: center;
      max-width: 600px;
      width: 100%;
      box-shadow: var(--shadow-lg);
    }

    .success-icon {
      color: var(--accent-success);
      margin-bottom: 2rem;
      animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    h1 {
      font-size: 2rem;
      color: var(--text-primary);
    }

    .text-secondary {
      font-size: 1.125rem;
      line-height: 1.6;
    }

    .order-id {
      color: var(--accent-primary);
    }

    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ThankYouComponent implements OnInit {
    orderId = '';

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.orderId = params.get('orderId') || 'UNKNOWN';
        });
    }
}
