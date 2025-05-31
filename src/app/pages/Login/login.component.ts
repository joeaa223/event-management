import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoggedIn = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      console.log("✅ Navigating to /home...");
      if (email === 'admin@example.com' && password === '123456') {
        alert('Login Successful');

        this.authService.login(); 
        this.router.navigate(['/home']);
      } else {
        alert('Invalid email or password');
      }
    }
  }
}
