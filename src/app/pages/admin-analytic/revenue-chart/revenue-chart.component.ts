import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" id="revenueChartContainer"></div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class RevenueChartComponent implements OnChanges {
  @Input() events: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && this.events && this.events.length > 0) {
      this.renderChart();
    }
  }

  renderChart(): void {
    const containerId = 'revenueChartContainer';
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    // Clear previous chart if any
    container.innerHTML = '';
    
    // Sort events by revenue for better visualization
    const sortedEvents = [...this.events]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5); // Show only top 5 events for clarity
    
    // Create formatted data for the chart
    const data = sortedEvents.map(event => ({
      name: this.truncateEventName(event.name),
      value: event.totalRevenue || 0,
      color: this.getRandomColor(event.name)
    }));
    
    // Calculate chart dimensions
    const chartWidth = container.clientWidth;
    const chartHeight = container.clientHeight;
    const barHeight = (chartHeight - 100) / data.length;
    const maxValue = Math.max(...data.map(item => item.value)) * 1.1; // Add 10% for spacing
    
    // Create SVG for horizontal bar chart
    let html = `
      <svg width="100%" height="100%" viewBox="0 0 ${chartWidth} ${chartHeight}">
        <!-- Chart title -->
        <text x="${chartWidth / 2}" y="20" font-size="16" font-weight="bold" text-anchor="middle">Revenue by Event (Top 5)</text>
        
        <!-- Y-axis (Event names) -->
        <line x1="150" y1="40" x2="150" y2="${chartHeight - 30}" stroke="#ccc" />
        
        <!-- X-axis (Revenue values) -->
        <line x1="150" y1="${chartHeight - 30}" x2="${chartWidth - 20}" y2="${chartHeight - 30}" stroke="#ccc" />
        <text x="${chartWidth - 10}" y="${chartHeight - 15}" font-size="12" text-anchor="end">Revenue (RM)</text>
    `;
    
    // Add horizontal bars for each event
    data.forEach((item, index) => {
      const barWidth = (item.value / maxValue) * (chartWidth - 200);
      const y = 50 + (index * (barHeight + 10));
      
      html += `
        <!-- Bar for ${item.name} -->
        <rect 
          x="150" 
          y="${y}" 
          width="${barWidth}" 
          height="${barHeight}" 
          fill="${item.color}" 
          rx="5" 
          ry="5"
        />
        
        <!-- Event name -->
        <text 
          x="145" 
          y="${y + barHeight/2}" 
          font-size="12" 
          text-anchor="end" 
          dominant-baseline="middle"
        >${item.name}</text>
        
        <!-- Revenue value -->
        <text 
          x="${150 + barWidth + 5}" 
          y="${y + barHeight/2}" 
          font-size="12" 
          font-weight="bold" 
          text-anchor="start" 
          dominant-baseline="middle"
        >RM ${item.value.toLocaleString()}</text>
      `;
    });
    
    html += '</svg>';
    container.innerHTML = html;
  }
  
  // Helper method to truncate long event names
  private truncateEventName(name: string): string {
    return name.length > 20 ? name.substring(0, 18) + '...' : name;
  }
  
  // Helper method to generate deterministic colors based on event name
  private getRandomColor(seed: string): string {
    // Simple hash function to generate a number from a string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to RGB
    const r = (hash & 0xFF) % 200 + 50; // 50-250 range to avoid too dark/light colors
    const g = ((hash >> 8) & 0xFF) % 200 + 50;
    const b = ((hash >> 16) & 0xFF) % 200 + 50;
    
    return `rgb(${r}, ${g}, ${b})`;
  }
}