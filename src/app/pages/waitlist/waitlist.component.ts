import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WaitlistService } from '../../services/waitlist.service';
import { Waitlist } from '../../models/waitlist.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class WaitlistComponent implements OnInit {
  waitlistForm: FormGroup;
  isOnWaitlist = false;
  message = '';
  currentWaitlistId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private waitlistService: WaitlistService,
    private router: Router
  ) {
    this.waitlistForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // 不再需要检查等待列表状态
  }

  Backbtn(): void {
    this.router.navigate(['/event-check']);
  }

  updateMessage(): void {
    if (this.isOnWaitlist) {
      this.message = `You are already on the waitlist.`;
    } else {
      this.message = '';
    }
  }

  joinWaitlist(): void {
    if (this.waitlistForm.invalid) {
      alert('Please provide valid details.');
      return;
    }

    const waitlistData: Waitlist = {
      name: this.waitlistForm.value.name,
      phone: this.waitlistForm.value.phone,
      email: this.waitlistForm.value.email
    };

    console.log('Sending waitlist data:', waitlistData);

    this.waitlistService.addToWaitlist(waitlistData).subscribe(
      response => {
        console.log('Waitlist response:', response);
        this.currentWaitlistId = response._id || null;
        this.isOnWaitlist = true;
        this.message = 'You have successfully joined the waitlist!';
        this.waitlistForm.reset();
      },
      error => {
        console.error('Error joining waitlist:', error);
        alert('Failed to join waitlist. Please try again.');
      }
    );
  }
}