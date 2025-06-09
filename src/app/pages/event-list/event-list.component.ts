import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../auth.service';

interface TicketPrice {
  zoneName: string;
  price: number;
  color: string;
  displayName?: string;
}

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  userRole: string = '';
  currentOrganizerId: string = '';
  showPriceModal: boolean = false;
  selectedEventPrices: TicketPrice[] = [];
  entryRules: string = '';
  showEntryRules: boolean = false;

  // Color to zone name mapping
  private colorToZoneName: { [key: string]: string } = {
    'red': 'VVIP',
    'pink': 'VIP',
    'green': 'PS1',
    'lightgreen': 'PS2',
    'blue': 'PS3',
    'lightblue': 'PS4',
    'yellow': 'PS5',
    'lightsalmon': 'PS6'
  };

  constructor(
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    // 测试直接使用 fetch API
    this.testFetchAPI();
  }

  ngOnInit() {
    this.loadUserData();
    this.loadEvents();
    this.eventService.getEvents().subscribe(
      (event) =>{
        this.entryRules = event.entryRules;
      }
    );
  }

  loadUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentOrganizerId = user.id;
      this.userRole = 'organizer';
    }
  }

  loadEvents() {
    if (this.currentOrganizerId) {
      this.eventService.getOrganizerEvents(this.currentOrganizerId).subscribe(
        response => {
          this.events = response.events;
          console.log('Loaded events:', this.events);
        },
        error => {
          console.error('Error loading events:', error);
        }
      );
    }
  }

  viewTicketPrices(eventId: string) {
    console.log('Viewing ticket prices for event:', eventId);
    
    // 先获取活动信息
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        console.log('Loaded event data:', event);
        if (event) {
          this.entryRules = event.entryRules || '';
          
          // 获取票价信息
          this.ticketService.getTicketPrices(eventId).subscribe({
            next: (response) => {
              console.log('Received ticket prices:', response);
              if (response && response.zonePrices && response.zonePrices.length > 0) {
                // Transform the zone names before displaying
                this.selectedEventPrices = response.zonePrices.map((price: TicketPrice) => ({
                  zoneName: price.zoneName,
                  price: price.price,
                  color: price.color,
                  displayName: this.colorToZoneName[price.color] || price.zoneName
                }));
                console.log('Transformed ticket prices:', this.selectedEventPrices);
              } else {
                console.log('No ticket prices found');
                this.selectedEventPrices = [];
              }
              this.showPriceModal = true;
            },
            error: (error) => {
              console.error('Error fetching ticket prices:', error);
              this.selectedEventPrices = [];
              this.showPriceModal = true;
            }
          });
        } else {
          console.error('Event not found');
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
      }
    });
  }

  toggleEntryRules() {
    this.showEntryRules = !this.showEntryRules;
  }

  closePriceModal() {
    this.showPriceModal = false;
    this.showEntryRules = false;
    this.selectedEventPrices = [];
  }

  deleteEvent(eventId: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        response => {
          console.log('Event deleted:', response);
          this.loadEvents();
          alert('Event deleted successfully!');
        },
        error => {
          console.error('Error deleting event:', error);
          alert('Failed to delete event. Please try again.');
        }
      );
    }
  }

  defineTicket(eventId: string) {
    this.router.navigate(['/define-ticket', eventId]);
  }

  goToCreateEvent() {
    this.router.navigate(['/event-creation']);
  }

  homePage() {
    this.router.navigate(['/event-organizer-home']);
  }

  pushEvent(eventId: string) {
    // First confirmation
    if (confirm('Are you sure you want to publish this event?')) {
      // Second confirmation
      if (confirm('This action cannot be undone. Do you really want to proceed?')) {
        this.eventService.publishEvent(eventId).subscribe(
          response => {
            console.log('Event published:', response);
            this.loadEvents(); // Reload events to update the UI
            alert('Event has been published successfully! 🎉');
          },
          error => {
            console.error('Error publishing event:', error);
            alert('Failed to publish event. Please try again.');
          }
        );
      }
    }
  }

  // 添加测试方法
  testFetchAPI() {
    fetch('https://event-management-production-ec59.up.railway.app/api/events')
      .then(res => res.json())
      .then(data => {
        console.log('Fetch API test result:', data);
      })
      .catch(error => {
        console.error('Fetch API test error:', error);
      });
  }
}


