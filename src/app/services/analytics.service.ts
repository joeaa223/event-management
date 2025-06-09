// services/analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalyticsData {
  ticketsSold: number;
  revenue: number;
  seatOccupancy: number;
  message?: string;  // Optional message property
  period?: string;   // Optional period name
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'https://event-management-production-ec59.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // Method to get analytics for all events (admin)
  getAnalytics(period: string): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics/${period}`);
  }

  // Method to get analytics for a specific organizer's events
  getOrganizerAnalytics(period: string, organizerId: string): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics/${period}/${organizerId}`);
  }
  
  // Method to get detailed analytics for all events (admin only)
  getAdminEventsAnalytics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/events-analytics`);
  }
}
