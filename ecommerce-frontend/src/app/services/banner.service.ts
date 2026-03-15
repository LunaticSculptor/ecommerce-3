import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class BannerService {
    private apiUrl = 'http://localhost:8080/banners';

    constructor(private http: HttpClient) { }

    getBanners(): Observable<Banner[]> {
        return this.http.get<Banner[]>(this.apiUrl);
    }
}
