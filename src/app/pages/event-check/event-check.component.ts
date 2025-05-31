import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-event-check',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './event-check.component.html',
  styleUrls: ['./event-check.component.css']
})
export class EventCheckComponent implements OnInit {
  publishedEvents: any[] = [];
  selectedCity: string = 'Klang Valley';
  searchTerm: string = '';
  filteredEvents: any[] = [];

  constructor(
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadPublishedEvents();
  }

  loadPublishedEvents() {
    this.eventService.getPublishedEvents().subscribe(
      response => {
        this.publishedEvents = response.events;
        this.filteredEvents = [...this.publishedEvents];
        console.log('Published events:', this.publishedEvents);
      },
      error => {
        console.error('Error loading published events:', error);
      }
    );
  }

  onSearch() {
    if (!this.searchTerm) {
      this.filteredEvents = [...this.publishedEvents];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredEvents = this.publishedEvents.filter(event => 
      event.name.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower)
    );
  }

  onEventClick(eventId: string) {
    this.router.navigate(['/event-details', eventId]);
  }

  navigateToHome() {
    this.router.navigate(['/event-check']);
  }

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCity = target.value;
    console.log('Selected city:', this.selectedCity);
  }

  waitlist() {
    this.router.navigate(['/waitlist']);
  }

  // New navigation methods for login buttons
  navigateToOrganizerLogin() {
    this.router.navigate(['/log-event-organizer']);
  }

  navigateToAdminLogin() {
    this.router.navigate(['/login']);
  }
}