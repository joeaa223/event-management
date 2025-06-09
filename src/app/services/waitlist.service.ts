import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Waitlist } from '../models/waitlist.model';

@Injectable({
  providedIn: 'root'
})
export class WaitlistService {
  private apiUrl = 'https://event-management-production-ec59.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // 添加用户到等待列表
  addToWaitlist(waitlist: Waitlist): Observable<Waitlist> {
    return this.http.post<Waitlist>(this.apiUrl, waitlist);
  }

  // 检查用户是否在等待列表中
  checkWaitlistStatus(phone: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${phone}`);
  }

  // 获取等待列表中的用户数量
  getWaitlistCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
} 