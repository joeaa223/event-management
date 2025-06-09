import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-organizer',
  templateUrl: './log-event-organizer.component.html',
  styleUrls: ['./log-event-organizer.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginOrganizer {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post<{message: string, user: any}>('https://event-management-production-ec59.up.railway.app/api/login', this.registerForm.value)
        .subscribe(
          response => {
            console.log('Login successful:', response);
            localStorage.setItem('userData', JSON.stringify(response.user));
            alert('Login successful!');
            this.router.navigate(['/event-organizer-home']);
          },
          error => {
            console.error('Login failed:', error);
            this.errorMessage = error.error.message || 'Login failed. Please check your credentials.';
          }
        );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly!';
    }
  }
}