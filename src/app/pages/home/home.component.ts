import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
    constructor(
      private router: Router,
      private authService: AuthService
    ) {}
    
    logout() {
      // Clear authentication state
      this.authService.logout();
      
      // Navigate to the event-check page (main/index page)
      this.router.navigate(['/event-check']);
    }
}