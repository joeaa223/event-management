import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizerService } from '../../services/organizer.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-organizer',
  templateUrl: './register-organizer.component.html',
  styleUrls: ['./register-organizer.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterOrganizerComponent {
  registerForm: FormGroup;
  emailExist = false;
  errorMessage = '';
  isLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private organizerService: OrganizerService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      organization: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    console.log('Form submitted:', this.registerForm.value);

    this.organizerService.registerOrganizer(this.registerForm.value)
      .subscribe(
        response => {
          console.log('Registration successful:', response);
          alert('Registered successfully! The login link has been sent to the event organizer email!');
          this.errorMessage = '';
          this.registerForm.reset();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        },
        error => {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      );
  }
}