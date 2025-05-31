import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class SetUpComponent implements OnInit {

  setupForm!: FormGroup;
  loginForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.setupForm = this.fb.group({
      eventName: ['', Validators.required],
      place: ['', Validators.required],
      ticketType: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      maxTickets: [null, [Validators.required, Validators.min(1)]],
      promoCode: ['']
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.setupForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.successMessage = '';
      return;
    }

    console.log('Ticket Setup Data:', this.setupForm.value);
    this.successMessage = 'Ticket setup saved successfully!';
    this.errorMessage = '';
    this.setupForm.reset();
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid email and password.';
      return;
    }

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (emailControl && passwordControl) {
      const email = emailControl.value;
      const password = passwordControl.value;
      
      this.authService.login(email, password)
        .subscribe(
          response => {
            console.log('Login response:', response);
            this.successMessage = 'Login successful!';
            this.errorMessage = '';
          },
          error => {
            console.error('Login failed:', error);
            this.errorMessage = 'Login failed. Please try again.';
            this.successMessage = '';
          }
        );
    }
  }
}