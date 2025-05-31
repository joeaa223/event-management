import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';

interface PaymentSeat {
  seatId: string;
  price: number;
  ticketType: string;
  discount: number;
  finalPrice: number;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaymentComponent implements OnInit {
  eventId: string = '';
  eventName: string = '';
  eventDate: string = '';
  eventVenue: string = '';
  eventTime: string = '';
  
  selectedSeats: PaymentSeat[] = [];
  originalTotal: number = 0;
  discountTotal: number = 0;
  finalTotal: number = 0;
  
  selectedPaymentMethod: string = '';
  
  ticketTypes = [
    { id: 'adult', name: 'Adult Ticket', discount: 0 },
    { id: 'child', name: 'Child Ticket', discount: 0.2 },
    { id: 'senior', name: 'Senior Ticket', discount: 0.3 },
    { id: 'disabled', name: 'OKU Ticket', discount: 0.4 }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {
    console.log('PaymentComponent constructed');
  }

  ngOnInit() {
    console.log('PaymentComponent initialized');
    
    // 尝试加载支付数据
    if (!this.loadPaymentData()) {
      console.error('Failed to load payment data');
      
      // 清除所有支付相关数据
      Object.keys(localStorage)
        .filter(key => key.startsWith('payment'))
        .forEach(key => localStorage.removeItem(key));
      
      // 返回到事件列表页面
      this.router.navigate(['/event-list']);
      return;
    }
    
    console.log('Payment data loaded successfully', {
      eventId: this.eventId,
      eventName: this.eventName,
      seats: this.selectedSeats,
      total: this.finalTotal
    });
  }

  private loadEventDetails(): boolean {
    console.log('Starting loadEventDetails');
    
    const eventId = localStorage.getItem('paymentEventId');
    const eventName = localStorage.getItem('paymentEventName');
    const eventVenue = localStorage.getItem('paymentEventVenue');

    console.log('Event details from localStorage:', {
      eventId,
      eventName,
      eventVenue
    });

    if (!eventId || !eventName || !eventVenue) {
      console.error('Missing event details:', {
        hasEventId: !!eventId,
        hasEventName: !!eventName,
        hasEventVenue: !!eventVenue
      });
      return false;
    }

    this.eventId = eventId;
    this.eventName = eventName;
    this.eventVenue = eventVenue;
    
    return true;
  }

  private loadPaymentData(): boolean {
    console.log('Starting loadPaymentData');
    
    // 获取所有必需的数据
    const eventId = localStorage.getItem('paymentEventId');
    const eventName = localStorage.getItem('paymentEventName');
    const eventVenue = localStorage.getItem('paymentEventVenue');
    const eventDate = localStorage.getItem('paymentEventDate');
    const eventTime = localStorage.getItem('paymentEventTime');
    const seatsJson = localStorage.getItem('paymentSeats');
    const pricesJson = localStorage.getItem('paymentPrices');
    const amount = localStorage.getItem('paymentAmount');
    
    console.log('Payment data from localStorage:', {
      eventId,
      eventName,
      eventVenue,
      eventDate,
      eventTime,
      seats: seatsJson,
      prices: pricesJson,
      amount
    });

    try {
      // 检查基本数据
      if (!eventId || !eventName) {
        console.error('Missing basic event data');
        return false;
      }

      // 设置基本事件信息
      this.eventId = eventId;
      this.eventName = eventName;
      this.eventVenue = eventVenue || 'Venue not specified';
      this.eventDate = eventDate || '';
      this.eventTime = eventTime || '';
      
      // 检查和解析座位数据
      if (!seatsJson || !pricesJson) {
        console.error('Missing seat or price data');
        return false;
      }

      const seats = JSON.parse(seatsJson);
      const prices = JSON.parse(pricesJson);
      
      if (!Array.isArray(seats) || !Array.isArray(prices)) {
        console.error('Invalid seat or price data format');
        return false;
      }

      // 设置座位信息
      this.selectedSeats = seats.map((seat: any, index: number) => ({
        seatId: `${seat.row}${seat.col}`,
        row: seat.row,
        col: seat.col,
        price: prices[index] || 0,
        ticketType: 'adult',
        discount: 0,
        finalPrice: prices[index] || 0
      }));
      
      // 计算总价
      this.calculateTotals();
      console.log('Payment data loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading payment data:', error);
      return false;
    }
  }

  onTicketTypeChange(seat: PaymentSeat, typeId: string) {
    const ticketType = this.ticketTypes.find(t => t.id === typeId);
    if (ticketType) {
      seat.ticketType = typeId;
      seat.discount = ticketType.discount;
      seat.finalPrice = seat.price * (1 - seat.discount);
      this.calculateTotals();
    }
  }

  calculateTotals() {
    this.originalTotal = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    this.finalTotal = this.selectedSeats.reduce((sum, seat) => sum + seat.finalPrice, 0);
    this.discountTotal = this.originalTotal - this.finalTotal;
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  processPayment(): void {
    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const navigationState = {
      amount: this.finalTotal,
      eventId: this.eventId,
      eventName: this.eventName,
      selectedSeats: this.selectedSeats
    };

    switch (this.selectedPaymentMethod) {
      case 'banking':
        this.router.navigate(['/online-banking'], { state: navigationState });
        break;
      default:
        console.error('Invalid payment method');
        break;
    }
  }

  goBack() {
    console.log('Navigating back to booking with eventId:', this.eventId);
    this.router.navigate(['/booking', this.eventId]);
  }
}
