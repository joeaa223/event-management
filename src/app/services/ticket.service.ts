import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://event-management-production-ec59.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // 保存票价信息
  saveTicketPrices(eventId: string, prices: any): Observable<any> {
    console.log('Saving ticket prices for event:', eventId, 'Prices:', prices);
    return this.http.post(`${this.apiUrl}/events/${eventId}/tickets`, { zonePrices: prices });
  }

  // 获取票价信息
  getTicketPrices(eventId: string): Observable<any> {
    console.log('Getting ticket prices for event:', eventId);
    return this.http.get(`${this.apiUrl}/events/${eventId}/tickets`);
  }

  // 获取座位布局
  getSeatLayout(eventId: string): Observable<any> {
    // 返回模拟的座位布局
    const mockLayout = [
      {
        row: 'A',
        cols: 43,
        zones: [
          { startCol: 1, endCol: 8, color: 'pink' },
          { startCol: 9, endCol: 35, color: 'red' },
          { startCol: 36, endCol: 43, color: 'pink' }
        ]
      },
      {
        row: 'B',
        cols: 44,
        zones: [
          { startCol: 1, endCol: 10, color: 'pink' },
          { startCol: 11, endCol: 35, color: 'red' },
          { startCol: 36, endCol: 44, color: 'pink' }
        ]
      },
      {
        row: 'C',
        cols: 46,
        zones: [
          { startCol: 1, endCol: 11, color: 'pink' },
          { startCol: 12, endCol: 35, color: 'red' },
          { startCol: 36, endCol: 46, color: 'pink' }
        ]
      },
      {
        row: 'D',
        cols: 47,
        zones: [
          { startCol: 1, endCol: 12, color: 'pink' },
          { startCol: 13, endCol: 35, color: 'red' },
          { startCol: 36, endCol: 47, color: 'pink' }
        ]
      },
      {
        row: 'E',
        cols: 47,
        zones: [
          { startCol: 1, endCol: 12, color: 'lightgreen' },
          { startCol: 13, endCol: 35, color: 'green' },
          { startCol: 36, endCol: 47, color: 'lightgreen' }
        ]
      },
      {
        row: 'F',
        cols: 47,
        zones: [
          { startCol: 1, endCol: 12, color: 'lightgreen' },
          { startCol: 13, endCol: 35, color: 'green' },
          { startCol: 36, endCol: 47, color: 'lightgreen' }
        ]
      },
      {
        row: 'G',
        cols: 47,
        zones: [
          { startCol: 1, endCol: 12, color: 'lightgreen' },
          { startCol: 13, endCol: 35, color: 'green' },
          { startCol: 36, endCol: 47, color: 'lightgreen' }
        ]
      },
      {
        row: 'H',
        cols: 46,
        zones: [
          { startCol: 1, endCol: 12, color: 'lightgreen' },
          { startCol: 13, endCol: 35, color: 'green' },
          { startCol: 36, endCol: 46, color: 'lightgreen' }
        ]
      },
      {
        row: 'J',
        cols: 45,
        zones: [
          { startCol: 1, endCol: 10, color: 'lightblue' },
          { startCol: 11, endCol: 14, color: 'black' },
          { startCol: 15, endCol: 29, color: 'blue' },
          { startCol: 30, endCol: 35, color: 'black' },
          { startCol: 36, endCol: 45, color: 'lightblue' }
        ]
      },
      {
        row: 'K',
        cols: 43,
        zones: [
          { startCol: 1, endCol: 8, color: 'lightblue' },
          { startCol: 9, endCol: 14, color: 'black' },
          { startCol: 15, endCol: 30, color: 'blue' },
          { startCol: 31, endCol: 35, color: 'black' },
          { startCol: 36, endCol: 43, color: 'lightblue' }
        ]
      },
      {
        row: 'L',
        cols: 40,
        zones: [
          { startCol: 1, endCol: 5, color: 'lightblue' },
          { startCol: 6, endCol: 35, color: 'black' },
          { startCol: 36, endCol: 40, color: 'lightblue' }
        ]
      },
      {
        row: 'AA',
        cols: 50,
        zones: [
          { startCol: 1, endCol: 13, color: 'lightsalmon' },
          { startCol: 14, endCol: 36, color: 'yellow' },
          { startCol: 37, endCol: 50, color: 'lightsalmon' }
        ]
      },
      {
        row: 'BB',
        cols: 50,
        zones: [
          { startCol: 1, endCol: 13, color: 'lightsalmon' },
          { startCol: 14, endCol: 36, color: 'yellow' },
          { startCol: 37, endCol: 50, color: 'lightsalmon' }
        ]
      },
      {
        row: 'CC',
        cols: 50,
        zones: [
          { startCol: 1, endCol: 13, color: 'lightsalmon' },
          { startCol: 14, endCol: 36, color: 'yellow' },
          { startCol: 37, endCol: 50, color: 'lightsalmon' }
        ]
      },
      {
        row: 'DD',
        cols: 49,
        zones: [
          { startCol: 1, endCol: 13, color: 'lightsalmon' },
          { startCol: 14, endCol: 36, color: 'yellow' },
          { startCol: 37, endCol: 49, color: 'lightsalmon' }
        ]
      },
      {
        row: 'EE',
        cols: 48,
        zones: [
          { startCol: 1, endCol: 12, color: 'lightsalmon' },
          { startCol: 13, endCol: 36, color: 'black' },
          { startCol: 37, endCol: 48, color: 'lightsalmon' }
        ]
      }
    ];
    return of(mockLayout);
  }

  // 获取座位状态（已预订/可用）
  getSeatStatus(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/seats/status`);
  }

  // 检查座位是否可用
  checkSeatAvailability(eventId: string, seats: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/${eventId}/seats/check`, { seats });
  }

  updateEvent(eventId: string, eventData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/events/${eventId}`, eventData);
  }
} 