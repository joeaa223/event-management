import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { TicketSalesChartComponent } from './ticket-sales-chart/ticket-sales-chart.component';

interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  ticketsSold: number;
  totalRevenue: number;
  organizerName: string;
}

@Component({
  selector: 'app-admin-analytic',
  templateUrl: './admin-analytic.component.html',
  styleUrls: ['./admin-analytic.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule,
    RevenueChartComponent,
    TicketSalesChartComponent
  ]
})
export class AdminAnalyticComponent implements OnInit {
  events: Event[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchEventAnalytics();
  }

  fetchEventAnalytics() {
    this.loading = true;
    this.http.get<Event[]>('https://event-management-production-ec59.up.railway.app/api/admin/events-analytics')
      .subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching event analytics:', error);
          this.error = 'Failed to load event analytics';
          this.loading = false;
        }
      });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  back() {
    this.router.navigate(['/home']);
  }
}