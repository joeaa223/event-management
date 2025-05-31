import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-creation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-creation.component.html',
  styleUrl: './event-creation.component.css'
})
export class EventCreationComponent {
  event = {
    name: '',
    date: '',
    time: '',
    description: '',
    image: '',
    organizerId: '',
    entryRules: ''
  };

  existingEvents: string[] = [];
  today: string;
  maxImageSize = 5 * 1024 * 1024; // 5MB

  constructor(
    private router: Router,
    private eventService: EventService
  ) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.loadExistingEvents();
    
    // 从 localStorage 获取当前登录的组织者 ID
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.event.organizerId = user.id;
    }
  }

  loadExistingEvents() {
    this.eventService.getEvents().subscribe(
      response => {
        this.existingEvents = response.events.map((e: any) => e.date);
      },
      error => {
        console.error('Error loading events:', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // 检查文件大小
      if (file.size > this.maxImageSize) {
        alert('Image size should not exceed 5MB');
        return;
      }

      // 检查文件类型
      if (!file.type.match(/image\/(jpg|jpeg|png|gif)/)) {
        alert('Only image files (jpg, jpeg, png, gif) are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // 创建图片对象以获取尺寸
        const img = new Image();
        img.onload = () => {
          // 创建 canvas 进行图片压缩
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 如果图片太大，进行等比例缩放
          const maxDimension = 1200;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // 绘制压缩后的图片
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // 转换为 base64 格式，使用较低的质量
          this.event.image = canvas.toDataURL('image/jpeg', 0.7);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  createEvent() {
    if (!this.event.name || !this.event.date || !this.event.time) {
      alert("Please fill in all required fields!");
      return;
    }

    if (this.isDateDisabled(this.event.date)) {
      alert('Selected date already has an event!');
      return;
    }

    // 如果没有上传图片，设置为空字符串
    if (!this.event.image) {
      this.event.image = '';
    }

    this.eventService.createEvent(this.event).subscribe(
      response => {
        console.log('Event created:', response);
        alert("Event created successfully!");
        this.router.navigate(['/event-list']);
      },
      error => {
        console.error('Error creating event:', error);
        alert("Failed to create event. Please try again.");
      }
    );
  }

  isDateDisabled(date: string): boolean {
    return this.existingEvents.includes(date);
  }

  eventOrganizerPage() {
    this.router.navigate(['/event-organizer-home']);
  }
}