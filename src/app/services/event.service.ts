import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://event-management-production-ec59.up.railway.app/api';

  constructor(private http: HttpClient) {}

  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, eventData);
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events`);
  }

  getOrganizerEvents(organizerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/organizer/${organizerId}`);
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${eventId}`);
  }

  publishEvent(eventId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/events/${eventId}/publish`, { isPublished: true });
  }

  getPublishedEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/published`);
  }

  getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}`);
  }

  updateEvent(eventId: string, eventData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/events/${eventId}`, eventData);
  }
} 