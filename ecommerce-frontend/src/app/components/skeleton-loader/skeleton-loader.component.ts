import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="skeleton" [style.width]="width" [style.height]="height" [style.border-radius]="borderRadius"></div>
  `
})
export class SkeletonLoaderComponent {
    @Input() width: string = '100%';
    @Input() height: string = '20px';
    @Input() borderRadius: string = '4px';
}
