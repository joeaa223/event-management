import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';
import { HttpClientModule } from '@angular/common/http';
import { MetricsChartComponent } from './metrics-chart/metrics-chart.component';
import { OccupancyChartComponent } from './occupancy-chart/occupancy-chart.component';

@Component({
  selector: 'app-analytic-report',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    MetricsChartComponent,
    OccupancyChartComponent
  ],
  templateUrl: './analytic-report.component.html',
  styleUrl: './analytic-report.component.css'
})
export class AnalyticReportComponent implements OnInit {
  reportForm!: FormGroup;
  reportData: AnalyticsData | null = null;
  loading: boolean = false;
  error: string | null = null;
  chartData: any = null;
  organizerId: string = '';
  isAdmin: boolean = false;
  noDataMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      period: ['daily'] 
    });

    // Get the user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.organizerId = user.id;
      
      // Check if the user is an admin
      this.isAdmin = user.role === 'admin';
      
      this.loadReportData();
    } else {
      this.error = 'User data not found. Please log in again.';
    }
  }

  loadReportData(): void {
    if (!this.organizerId && !this.isAdmin) {
      this.error = 'User ID not found. Please log in again.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.noDataMessage = null;
    const period = this.reportForm.value.period;

    // Use the appropriate analytics endpoint based on user role
    if (this.isAdmin) {
      // Admin can see all events analytics
      this.analyticsService.getAnalytics(period).subscribe({
        next: (data) => {
          console.log('Received analytics data:', data);
          this.reportData = data;
          
          // Check if there's a message in the response
          if (data.message) {
            this.noDataMessage = data.message;
          }
          
          this.prepareChartData();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading analytics:', err);
          this.error = `Failed to load analytics data: ${err.message || 'Unknown error'}`;
          this.loading = false;
        }
      });
    } else {
      // Organizer can only see their own events
      this.analyticsService.getOrganizerAnalytics(period, this.organizerId).subscribe({
        next: (data) => {
          console.log('Received organizer analytics data:', data);
          this.reportData = data;
          
          // Check if there's a message in the response
          if (data.message) {
            this.noDataMessage = data.message;
          }
          
          this.prepareChartData();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading organizer analytics:', err);
          this.error = `Failed to load analytics data: ${err.message || 'Unknown error'}`;
          this.loading = false;
        }
      });
    }
  }

  prepareChartData(): void {
    if (this.reportData) {
      this.chartData = {
        ticketsSold: this.reportData.ticketsSold,
        revenue: this.reportData.revenue,
        occupancyRate: this.reportData.seatOccupancy
      };
    }
  }

  homePage() {
    // Redirect based on user role
    if (this.isAdmin) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/event-organizer-home']);
    }
  }
}