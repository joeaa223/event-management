import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class EventDetailsComponent implements OnInit {

  showLanguageDropdown = false;
  currentLanguage = 'EN';
  selectedCity = 'Klang Valley';  
  event:any;
  entryRules:string ='';
  formattedRules: string[] = [];
  showEntryRules :boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private eventService: EventService) {}

  goToBooking() {
    console.log('Current event:', this.event);
    // 检查不同可能的 ID 字段名
    const eventId = this.event?._id || this.event?.id || this.event?.eventId;
    
    if (eventId) {
      console.log('Navigating to booking with ID:', eventId);
      this.router.navigate(['/booking', eventId]);
    } else {
      console.error('No event ID available', this.event);
    }
  }

  backToEvent(){
    this.router.navigate(['/event-check']);
  }

  navigateToHome() {
    this.router.navigate(['/event-check']);
  }

  onCityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCity = target.value;
  }

  waitlist(){
    this.router.navigate(['/waitlist']);
  }

  formatEntryRules(rules: string): string[] {
    if (!rules) return [];
    
    // 预定义的规则标题
    const ruleHeaders = [
      'Ticket Required for Entry',
      'Identity Verification',
      'No Prohibited Items',
      'Follow Seat Assignments',
      'Late Arrival Policy',
      'Priority for Children and Elderly',
      'No Unauthorized Recording',
      'Compliance with Event Regulations',
      'Security Checks',
      'Emergency Procedures'
    ];
    
    // 使用规则标题来分割文本
    let formattedRules: string[] = [];
    let currentText = rules;
    
    ruleHeaders.forEach((header, index) => {
      const headerIndex = currentText.indexOf(header);
      if (headerIndex !== -1) {
        // 找到下一个标题的位置
        let nextHeaderIndex = -1;
        for (let i = index + 1; i < ruleHeaders.length; i++) {
          const nextHeader = ruleHeaders[i];
          const nextIndex = currentText.indexOf(nextHeader);
          if (nextIndex !== -1) {
            nextHeaderIndex = nextIndex;
            break;
          }
        }
        
        // 提取当前规则的完整文本
        const ruleText = nextHeaderIndex !== -1 
          ? currentText.substring(headerIndex, nextHeaderIndex).trim()
          : currentText.substring(headerIndex).trim();
          
        formattedRules.push(`${formattedRules.length + 1}. ${ruleText}`);
      }
    });
    
    return formattedRules;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      console.log('Event ID:', eventId);
      this.eventService.getEventById(eventId).subscribe(
        eventData => {
          console.log('Event Data:', eventData);
          this.event = eventData;
          this.entryRules = eventData.entryRules;
          this.formattedRules = this.formatEntryRules(eventData.entryRules);
        },
        error => {
          console.error('Error fetching event details:', error);
        }
      );
    });
  }
}
