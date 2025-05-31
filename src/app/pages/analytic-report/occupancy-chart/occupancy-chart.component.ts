import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-occupancy-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" id="occupancyChartContainer"></div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class OccupancyChartComponent implements OnChanges {
  @Input() occupancyRate: number = 0;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['occupancyRate']) {
      this.renderChart();
    }
  }

  renderChart(): void {
    const containerId = 'occupancyChartContainer';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Clear previous chart if any
    container.innerHTML = '';
    
    // Ensure occupancy is a valid number between 0-100
    const safeOccupancy = Math.min(Math.max(0, this.occupancyRate || 0), 100);
    const availableSpace = 100 - safeOccupancy;
    
    // Create and render SVG for pie chart
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    const occupiedEndAngle = (safeOccupancy / 100) * 360;
    const availableStartAngle = occupiedEndAngle;
    
    // Function to convert polar coordinates to cartesian
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };
    
    // Function to create arc paths
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
      return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "Z"
      ].join(" ");
    };
    
    // Create the SVG string
    let html = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        <!-- Occupied portion -->
        <path d="${describeArc(centerX, centerY, radius, 0, occupiedEndAngle)}" 
              fill="#00C49F" stroke="white" stroke-width="1" />
        
        <!-- Available portion -->
        <path d="${describeArc(centerX, centerY, radius, availableStartAngle, 360)}" 
              fill="#DDDDDD" stroke="white" stroke-width="1" />
        
        <!-- Center hole for donut chart -->
        <circle cx="${centerX}" cy="${centerY}" r="${radius * 0.6}" fill="white" />
        
        <!-- Percentage label in center -->
        <text x="${centerX}" y="${centerY}" 
              font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle">
          ${safeOccupancy.toFixed(1)}%
        </text>
        
        <!-- Legend -->
        <rect x="20" y="${height - 50}" width="15" height="15" fill="#00C49F" />
        <text x="40" y="${height - 37}" font-size="12" text-anchor="start">Occupied (${safeOccupancy.toFixed(1)}%)</text>
        
        <rect x="20" y="${height - 30}" width="15" height="15" fill="#DDDDDD" />
        <text x="40" y="${height - 17}" font-size="12" text-anchor="start">Available (${availableSpace.toFixed(1)}%)</text>
      </svg>
    `;
    
    container.innerHTML = html;
  }
}