import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:8080/orders';

    constructor(private http: HttpClient) { }

    placeOrder(orderRequest: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, orderRequest);
    }
}
