import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login(email: string, password: string) {
        const loginData = { email: email, password: password };
        return this.http.post<{message: string, user: any}>(
            'http://localhost:3001/api/login',
            loginData
        );
    }
} 