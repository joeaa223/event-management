import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isLoggedInSubject = new BehaviorSubject<boolean>(false); // 默认值 false
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    const savedStatus = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(savedStatus);
  }

  private getInitialAuthState(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  login(): void {
    if (!this.isAuthenticated()) {
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedInSubject.next(true);
      console.log('✅ 用户已登录');
    }
  }


  logout(): void {
    if (this.isAuthenticated()) {
      localStorage.removeItem('isLoggedIn');
      this.isLoggedInSubject.next(false);
      console.log('🚪 用户已登出');
    }
  }
}


