import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { EventService } from '../../services/event.service';
import { forkJoin } from 'rxjs';

interface Seat {
  row: string;
  col: number;
  price: number;
  zoneColor: string;
  isSelected: boolean;
  isBooked: boolean;
}

interface SeatLayout {
  row: string;
  cols: number;
  zones: {
    startCol: number;
    endCol: number;
    color: string;
  }[];
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BookingComponent implements OnInit {
  eventId: string = '';
  eventName: string = '';
  eventDate: string = '';
  eventTime: string = '';
  eventVenue: string = '';
  seats: Seat[][] = [];
  selectedSeats: Seat[] = [];
  zonePrices: any[] = [];
  totalAmount: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.loadEventData();
    });
  }

  loadEventData() {
    this.isLoading = true;
    this.error = null;

    // 获取活动详情
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        if (event) {
          this.eventName = event.title || event.name || '';
          this.eventDate = event.eventDate || event.date || '';
          this.eventTime = event.eventTime || event.time || '';
          this.eventVenue = event.venue || '';
          
          // 获取座位布局和价格
          forkJoin({
            layout: this.ticketService.getSeatLayout(this.eventId),
            prices: this.ticketService.getTicketPrices(this.eventId),
            status: this.ticketService.getSeatStatus(this.eventId)
          }).subscribe({
            next: (data) => {
              this.zonePrices = data.prices.zonePrices;
              this.initializeSeats(data.layout, data.status);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('加载座位数据失败:', err);
              this.error = '加载座位数据失败，请重试';
              this.isLoading = false;
            }
          });
        }
      },
      error: (err) => {
        console.error('加载活动详情失败:', err);
        this.error = '加载活动详情失败，请重试';
        this.isLoading = false;
      }
    });
  }

  initializeSeats(layout: SeatLayout[], seatStatus: any) {
    this.seats = layout.map(section => {
      const totalColumns = section.cols;
      const middleColumn = Math.ceil(totalColumns / 2);
      
      // 创建一个数组来存储这一行的所有座位
      const rowSeats: Seat[] = [];
      
      // 计算这一行应该有多少个座位
      const seatsPerSide = Math.floor(totalColumns / 2);
      const startCol = middleColumn - seatsPerSide;
      const endCol = middleColumn + seatsPerSide;
      
      // 从左到右创建座位
      for (let colNumber = totalColumns; colNumber >= 1; colNumber--) {
        let seatColor = 'black'; // 默认颜色

        // 根据区域设置颜色
        for (const zone of section.zones) {
          if (colNumber >= zone.startCol && colNumber <= zone.endCol) {
            seatColor = zone.color;
            break;
          }
        }

        // 检查座位是否已被预订
        const isBooked = seatStatus.some((status: any) => 
          status.row === section.row && 
          status.col === colNumber && 
          status.isBooked
        );

        // 创建座位对象
        const seat: Seat = {
          row: section.row,
          col: colNumber,
          price: this.getPriceByZoneColor(seatColor),
          zoneColor: seatColor,
          isSelected: false,
          isBooked: isBooked // 设置座位的预订状态
        };

        rowSeats.push(seat);
      }

      return rowSeats;
    });
  }

  getPriceByZoneColor(color: string): number {
    const zonePrice = this.zonePrices.find(zp => zp.color === color);
    return zonePrice ? zonePrice.price : 0;
  }

  toggleSeatSelection(seat: Seat) {
    if (seat.isBooked || seat.zoneColor === 'black') {
      return; // 如果座位已被预订或是黑色区域，直接返回
    }

    seat.isSelected = !seat.isSelected;
    
    if (seat.isSelected) {
      // 检查座位是否仍然可用
      this.ticketService.checkSeatAvailability(this.eventId, [seat]).subscribe({
        next: (response) => {
          if (response.available) {
            this.selectedSeats.push(seat);
            this.calculateTotal();
          } else {
            seat.isSelected = false;
            seat.isBooked = true; // 如果座位已被预订，更新状态
            alert('Sorry, this seat has been booked by another user');
          }
        },
        error: (err) => {
          console.error('Failed to check seat availability:', err);
          seat.isSelected = false;
          alert('Failed to check seat status, please try again');
        }
      });
    } else {
      const index = this.selectedSeats.findIndex(
        s => s.row === seat.row && s.col === seat.col
      );
      if (index !== -1) {
        this.selectedSeats.splice(index, 1);
        this.calculateTotal();
      }
    }
  }

  calculateTotal() {
    this.totalAmount = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  proceedToPayment() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    try {
      // 清除之前的数据
      Object.keys(localStorage)
        .filter(key => key.startsWith('payment'))
        .forEach(key => localStorage.removeItem(key));

      // 存储新数据
      localStorage.setItem('paymentEventId', this.eventId);
      localStorage.setItem('paymentEventName', this.eventName);
      localStorage.setItem('paymentEventDate', this.eventDate);
      localStorage.setItem('paymentEventTime', this.eventTime);
      localStorage.setItem('paymentSeats', JSON.stringify(this.selectedSeats.map(seat => ({
        row: seat.row,
        col: seat.col
      }))));
      localStorage.setItem('paymentPrices', JSON.stringify(this.selectedSeats.map(seat => seat.price)));
      localStorage.setItem('paymentAmount', this.totalAmount.toString());
      localStorage.setItem('paymentEventVenue', this.eventVenue);

      // 导航到支付页面
      this.router.navigate(['/payment']);
    } catch (error) {
      console.error('Error in proceedToPayment:', error);
      alert('An error occurred. Please try again.');
    }
  }

  goBack() {
    this.router.navigate(['/event-details', this.eventId]);
  }

  // 添加转换方法
  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
