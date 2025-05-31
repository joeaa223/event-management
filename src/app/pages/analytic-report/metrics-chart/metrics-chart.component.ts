import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" id="metricsChartContainer"></div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class MetricsChartComponent implements OnChanges {
  @Input() chartData: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData) {
      this.renderChart();
    }
  }

  renderChart(): void {
    const containerId = 'metricsChartContainer';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Clear previous chart if any
    container.innerHTML = '';
    
    // Create formatted data for the chart
    const data = [
      {
        name: 'Tickets Sold',
        value: this.chartData.ticketsSold || 0,
        fill: '#8884d8'
      },
      {
        name: 'Revenue (RM)',
        value: this.chartData.revenue || 0,
        fill: '#82ca9d'
      }
    ];
    
    // Create and render the chart using vanilla JS/HTML
    // Since we don't have direct access to React libraries
    const maxValue = Math.max(...data.map(item => item.value)) * 1.1; // Add 10% for spacing
    
    const chartWidth = container.clientWidth;
    const chartHeight = container.clientHeight;
    const barWidth = chartWidth / (data.length * 2); // Each bar takes half of the available width
    
    let html = `
      <svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}">
        <!-- Chart Axes -->
        <line x1="40" y1="${chartHeight - 30}" x2="${chartWidth - 20}" y2="${chartHeight - 30}" stroke="black" />
        <line x1="40" y1="20" x2="40" y2="${chartHeight - 30}" stroke="black" />
        
        <!-- Y-axis Labels -->
        <text x="5" y="25" font-size="10" text-anchor="start">${maxValue.toLocaleString()}</text>
        <text x="5" y="${chartHeight - 30}" font-size="10" text-anchor="start">0</text>
        
        <!-- Chart Legend -->
        <rect x="${chartWidth - 100}" y="10" width="10" height="10" fill="#8884d8" />
        <text x="${chartWidth - 85}" y="20" font-size="12" text-anchor="start">Ticket Sales</text>
        
        <rect x="${chartWidth - 100}" y="30" width="10" height="10" fill="#82ca9d" />
        <text x="${chartWidth - 85}" y="40" font-size="12" text-anchor="start">Revenue</text>
    `;
    
    // Add bars
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * (chartHeight - 50);
      const x = 60 + (index * (chartWidth - 100) / data.length);
      const y = chartHeight - 30 - barHeight;
      
      html += `
        <rect 
          x="${x}" 
          y="${y}" 
          width="${barWidth}" 
          height="${barHeight}" 
          fill="${item.fill}" 
        />
        <text 
          x="${x + barWidth/2}" 
          y="${y - 5}" 
          font-size="10" 
          text-anchor="middle"
        >${item.value.toLocaleString()}</text>
        <text 
          x="${x + barWidth/2}" 
          y="${chartHeight - 15}" 
          font-size="10" 
          text-anchor="middle"
        >${item.name}</text>
      `;
    });
    
    html += '</svg>';
    container.innerHTML = html;
  }
}