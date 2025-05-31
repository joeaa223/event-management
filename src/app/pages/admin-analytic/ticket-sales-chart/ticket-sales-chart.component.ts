import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-sales-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" id="ticketSalesChartContainer"></div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class TicketSalesChartComponent implements OnChanges {
  @Input() events: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && this.events && this.events.length > 0) {
      this.renderChart();
    }
  }

  renderChart(): void {
    const containerId = 'ticketSalesChartContainer';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Clear previous chart if any
    container.innerHTML = '';
    
    // Prepare data for pie chart
    const chartData = this.events
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 5); // Take top 5 events
    
    const totalTickets = chartData.reduce((sum, event) => sum + event.ticketsSold, 0);
    
    // Calculate dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create SVG for pie chart
    let html = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        <text x="${width/2}" y="30" font-size="16" font-weight="bold" text-anchor="middle">Ticket Sales Distribution</text>
    `;
    
    // Generate pie chart
    if (totalTickets > 0) {
      let startAngle = 0;
      
      // Draw pie slices
      chartData.forEach((event, index) => {
        const percentage = event.ticketsSold / totalTickets;
        const angle = percentage * 360;
        const endAngle = startAngle + angle;
        const color = this.getColorFromPalette(index);
        
        // Calculate arc path
        const slice = this.describeArc(centerX, centerY, radius, startAngle, endAngle);
        
        html += `
          <path d="${slice}" fill="${color}" stroke="white" stroke-width="1">
            <title>${event.name}: ${event.ticketsSold} tickets (${(percentage * 100).toFixed(1)}%)</title>
          </path>
        `;
        
        // Add to legend
        const legendY = height - 100 + (index * 20);
        html += `
          <rect x="20" y="${legendY}" width="15" height="15" fill="${color}" />
          <text x="40" y="${legendY + 12}" font-size="12" text-anchor="start">
            ${this.truncateEventName(event.name)} (${event.ticketsSold} tickets)
          </text>
        `;
        
        startAngle = endAngle;
      });
      
      // Add center hole for donut chart
      html += `<circle cx="${centerX}" cy="${centerY}" r="${radius * 0.6}" fill="white" />`;
      
      // Add total tickets in center
      html += `
        <text x="${centerX}" y="${centerY - 10}" font-size="16" font-weight="bold" text-anchor="middle">Total</text>
        <text x="${centerX}" y="${centerY + 15}" font-size="20" font-weight="bold" text-anchor="middle">${totalTickets}</text>
        <text x="${centerX}" y="${centerY + 35}" font-size="12" text-anchor="middle">tickets sold</text>
      `;
    } else {
      // No data scenario
      html += `
        <text x="${width/2}" y="${height/2}" font-size="16" text-anchor="middle">No ticket sales data available</text>
      `;
    }
    
    html += '</svg>';
    container.innerHTML = html;
  }
  
  // Helper function to describe arc path for pie chart
  private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  }
  
  // Helper function to convert polar coordinates to cartesian
  private polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): {x: number, y: number} {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
  // Helper method to truncate long event names
  private truncateEventName(name: string): string {
    return name.length > 15 ? name.substring(0, 13) + '...' : name;
  }
  
  // Get color from a predefined palette
  private getColorFromPalette(index: number): string {
    const palette = [
      '#FF6384', // red
      '#36A2EB', // blue
      '#FFCE56', // yellow
      '#4BC0C0', // teal
      '#9966FF', // purple
      '#FF9F40', // orange
      '#8AC44B', // green
      '#EA5F89', // pink
      '#95CFF5', // light blue
      '#D9B046'  // gold
    ];
    
    return palette[index % palette.length];
  }
}