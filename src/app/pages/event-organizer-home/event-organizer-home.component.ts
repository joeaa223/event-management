import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-event-organizer-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './event-organizer-home.component.html',
  styleUrl: './event-organizer-home.component.css'
})
export class EventOrganizerHomeComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear any user-specific data if needed
    localStorage.removeItem('userData');
    
    // Navigate to the event-check page (main/index page)
    this.router.navigate(['/event-check']);
  }
}