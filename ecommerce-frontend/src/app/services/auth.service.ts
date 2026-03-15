import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/auth';
    private userSubject = new BehaviorSubject<any>(null);
    public user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.userSubject.next(JSON.parse(savedUser));
        }
    }

    isLoggedIn(): boolean {
        return !!this.userSubject.value;
    }

    getUser(): any {
        return this.userSubject.value;
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            })
        );
    }

    signup(user: { email: string, password: string, name: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/signup`, user).pipe(
            tap(u => {
                localStorage.setItem('user', JSON.stringify(u));
                this.userSubject.next(u);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }
}
