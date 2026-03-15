import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/products';

    constructor(private http: HttpClient) { }

    getProducts(featured?: boolean, category?: string, page = 0, size = 10): Observable<any> {
        let params: any = { page, size };
        if (featured) params.featured = true;
        if (category) params.category = category;

        return this.http.get<any>(this.apiUrl, { params });
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    searchProducts(searchRequest: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/search`, searchRequest);
    }
}
