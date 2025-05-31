import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { EventService } from '../../services/event.service';

interface Seat {
    row: string;
    col: number;
    price: number | null;
    confirmed: boolean;
    zoneColor: string; // 颜色区域
  }
  
  interface ZonePrice {
    color: string;
    price: number;
    zoneName: string;
  }
  
  interface PriceMessage {
    color: string;
    zoneName: string;
    price: number;
  }
  
  @Component({
    selector: 'app-define-ticket',
    templateUrl: './define-ticket.component.html',
    styleUrl: './define-ticket.component.css',
    standalone: true,
    imports:[FormsModule, CommonModule],
  })
  export class DefineTicketComponent implements OnInit {
    eventId: string = ''; 
    seats: Seat[][] = []; 
    selectedZoneColor: string = ''; 
    selectedPrice: number | null = null; 
    zoneColors: string[] = ['red', 'pink', 'lightgreen', 'green', 'lightblue', 'blue', 'lightsalmon', 'yellow']; // 预定义颜色区域
    priceSummary: { [key: string]: number | null } = {};

    priceMessages: PriceMessage[] = [];
    rows: string[][] = [];
    selectedSeats: string[] = [];
    confirmedSeats: string[] = [];
    pricedSeats: string[] = [];
    selectedZone: string = '';
    zonePrice: number = 0;
    zonePrices: { zoneName: string; price: number; color: string }[] = [];
    message: string = '';
    entryRules: string = '';
    showEntryRulesDialog: boolean = false;
  
    // Color to zone name mapping with order
    private colorOrder: string[] = [
      'red',      // VVIP
      'pink',     // VIP
      'green',    // PS1
      'lightgreen', // PS2
      'blue',     // PS3
      'lightblue',  // PS4
      'yellow',   // PS5
      'lightsalmon' // PS6
    ];
  
    private colorToZoneName: { [key: string]: string } = {
      'red': 'VVIP',
      'pink': 'VIP',
      'green': 'PS1',
      'lightgreen': 'PS2',
      'blue': 'PS3',
      'lightblue': 'PS4',
      'yellow': 'PS5',
      'lightsalmon': 'PS6'
    };
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private ticketService: TicketService,
      private eventService: EventService
    ) {}
  
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const eventId = params.get('eventId');
        if (eventId) {
          this.eventId = eventId;
          console.log('Event ID received:', eventId);
          this.initializeSeats();
          this.loadExistingTickets();
        } else {
          console.error('Event ID not found');
          this.message = 'Event ID not found';
        }
      });
    }
  
    // 初始化座位并分配颜色
    initializeSeats() {
        const layout = [
          { row: 'A', cols: 43, color: 'red' }, 
          { row: 'B', cols: 44, color: 'red' },
          { row: 'C', cols: 46, color: 'blue' }, 
          { row: 'D', cols: 47, color: 'blue' },
          { row: 'E', cols: 47, color: 'green' }, 
          { row: 'F', cols: 47, color: 'green' },
          { row: 'G', cols: 47, color: 'yellow' }, 
          { row: 'H', cols: 46, color: 'yellow' },
          { row: 'J', cols: 45, color: 'yellow' },
          { row: 'K', cols: 43, color: 'yellow' },
          { row: 'L', cols: 40, color: 'yellow' },
          { row: 'AA', cols: 50, color: 'yellow' },
          { row: 'BB', cols: 50, color: 'yellow' },
          { row: 'CC', cols: 50, color: 'yellow' },
          { row: 'DD', cols: 49, color: 'yellow' },
          { row: 'EE', cols: 48, color: 'yellow' },
        ];
      
        this.seats = layout.map(section =>
          Array.from({ length: section.cols }, (_, index) => {
            const colNumber = section.cols - index; // 从 43 开始到 1
      
            let seatColor = section.color; // 默认颜色
      
            // 🎯 A 行特定列设置颜色
            if (section.row === 'A') {
              if ((colNumber >= 1 && colNumber <= 8) || (colNumber >= 36 && colNumber <= 43)) {
                seatColor = 'pink'; // 1-8 和 36-43 变粉色
              } else if (colNumber >= 15 && colNumber <= 33) {
                seatColor = 'red'; // 15-33 保持红色
              }
            }

            if (section.row === 'B') {
                if ((colNumber >= 1 && colNumber <= 10) || (colNumber >= 36 && colNumber <= 44)) {
                  seatColor = 'pink'; 
                } else if (colNumber >= 15 && colNumber <= 33) {
                  seatColor = 'red'; 
                }
            }

            if (section.row === 'C') {
                if ((colNumber >= 1 && colNumber <= 11) || (colNumber >= 36 && colNumber <= 46)) {
                  seatColor = 'pink'; 
                } else if (colNumber >= 12 && colNumber <= 35) {
                  seatColor = 'red'; 
                }
            }

            if (section.row === 'D') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 36 && colNumber <= 47)) {
                  seatColor = 'pink'; 
                } else if (colNumber >= 13 && colNumber <= 35) {
                  seatColor = 'red'; 
                }
            }

            if (section.row === 'E') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 36 && colNumber <= 47)) {
                  seatColor = 'lightgreen'; 
                } else if (colNumber >= 13 && colNumber <= 35) {
                  seatColor = 'green'; 
                }
            }

            if (section.row === 'F') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 36 && colNumber <= 47)) {
                  seatColor = 'lightgreen'; 
                } else if (colNumber >= 13 && colNumber <= 35) {
                  seatColor = 'green'; 
                }
            }

            if (section.row === 'G') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 36 && colNumber <= 47)) {
                  seatColor = 'lightgreen'; 
                } else if (colNumber >= 13 && colNumber <= 35) {
                  seatColor = 'green'; 
                }
            }

            if (section.row === 'H') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 36 && colNumber <= 47)) {
                  seatColor = 'lightgreen'; 
                } else if (colNumber >= 13 && colNumber <= 35) {
                  seatColor = 'green'; 
                }
            }

            if (section.row === 'J') {
                if ((colNumber >= 1 && colNumber <= 10) || (colNumber >= 36 && colNumber <= 45)) {
                  seatColor = 'lightblue'; 
                } else if (colNumber >= 15 && colNumber <= 29) {
                  seatColor = 'blue'; 
                } else if(colNumber >= 11 && colNumber <= 14){
                    seatColor = 'black';
                } else if(colNumber >= 30 && colNumber <= 35){
                    seatColor = 'black';
                }
            }

            if (section.row === 'K') {
                if ((colNumber >= 1 && colNumber <= 8) || (colNumber >= 36 && colNumber <= 45)) {
                  seatColor = 'lightblue'; 
                } else if (colNumber >= 15 && colNumber <= 30) {
                  seatColor = 'blue'; 
                } else if(colNumber >= 8 && colNumber <= 15){
                    seatColor = 'black';
                } else if(colNumber >= 30 && colNumber <= 35){
                    seatColor = 'black';
                }
            }

            if (section.row === 'L') {
                if ((colNumber >= 1 && colNumber <= 5) || (colNumber >= 36 && colNumber <= 40)) {
                  seatColor = 'lightblue'; 
                } else if (colNumber >= 5 && colNumber <= 36) {
                  seatColor = 'black'; 
                } 
            }

            if (section.row === 'H') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 36 && colNumber <= 47)) {
                  seatColor = 'lightgreen'; 
                } else if (colNumber >= 13 && colNumber <= 35) {
                  seatColor = 'green'; 
                }
            }

            if (section.row === 'AA') {
                if ((colNumber >= 1 && colNumber <= 13) || (colNumber >= 37 && colNumber <= 50)) {
                  seatColor = 'lightsalmon'; 
                } else if (colNumber >= 15 && colNumber <= 36) {
                  seatColor = 'yellow'; 
                }
            }

            if (section.row === 'BB') {
                if ((colNumber >= 1 && colNumber <= 13) || (colNumber >= 37 && colNumber <= 50)) {
                  seatColor = 'lightsalmon'; 
                } else if (colNumber >= 15 && colNumber <= 36) {
                  seatColor = 'yellow'; 
                }
            }

            if (section.row === 'CC') {
                if ((colNumber >= 1 && colNumber <= 13) || (colNumber >= 37 && colNumber <= 50)) {
                  seatColor = 'lightsalmon'; 
                } else if (colNumber >= 15 && colNumber <= 36) {
                  seatColor = 'yellow'; 
                }
            }

            if (section.row === 'DD') {
                if ((colNumber >= 1 && colNumber <= 13) || (colNumber >= 37 && colNumber <= 50)) {
                  seatColor = 'lightsalmon'; 
                } else if (colNumber >= 15 && colNumber <= 36) {
                  seatColor = 'yellow'; 
                }
            }

            if (section.row === 'EE') {
                if ((colNumber >= 1 && colNumber <= 12) || (colNumber >= 37 && colNumber <= 48)) {
                  seatColor = 'lightsalmon'; 
                } else if (colNumber >= 12 && colNumber <= 36) {
                  seatColor = 'black'; 
                }
            }
      
            return {
              row: section.row,
              col: colNumber,
              price: null,
              confirmed: false,
              zoneColor: seatColor, // ✅ 颜色已修改
              priced: false,
            };
          })
        );
      }
      
  
    // 批量设定某个颜色区域的价格
    applyPriceToZone() {
      if (!this.selectedZoneColor || this.selectedPrice === null) {
        alert('Please select a zone and enter a price');
        return;
      }
  
      // Update price summary
      this.priceSummary[this.selectedZoneColor] = this.selectedPrice;
  
      // Update seats with the new price
      this.seats.forEach(row => {
        row.forEach(seat => {
          if (seat.zoneColor === this.selectedZoneColor) {
            seat.price = this.selectedPrice;
          }
        });
      });
  
      // Update price messages
      this.updatePriceMessages();
  
      // Clear selection
      this.selectedZoneColor = '';
      this.selectedPrice = null;
      alert('Price set successfully!');
    }

    updatePriceMessages() {
        this.priceMessages = [];
        // 按照预定义的顺序遍历颜色
        for (const color of this.colorOrder) {
            const price = this.priceSummary[color];
            if (price !== null && price !== undefined) {
                this.priceMessages.push({
                    color: color,
                    zoneName: this.getZoneName(color),
                    price: price
                });
            }
        }
    }

    // Save seats to MongoDB
    saveSeats() {
      if (!this.eventId) {
        alert('Event ID not found');
        return;
      }

      // 只获取已设置价格的区域
      const zonePricesData = Object.entries(this.priceSummary)
          .filter(([color]) => color !== 'black' && this.priceSummary[color] !== null)
          .map(([color, price]) => ({
              zoneName: color,
              price: price || 0,
              color: color
          }));

      if (zonePricesData.length === 0) {
          alert('Please set at least one zone price');
          return;
      }

      // 保存票价到数据库
      this.ticketService.saveTicketPrices(this.eventId, zonePricesData).subscribe({
          next: (response) => {
              console.log('Ticket prices saved successfully:', response);
              
              // 保存入场规则
              if (this.entryRules) {
                  this.eventService.updateEvent(this.eventId, { entryRules: this.entryRules }).subscribe(
                      (eventResponse) => {
                          console.log('Entry rules saved successfully:', eventResponse);
                          alert('Ticket prices and entry rules saved successfully! ✅');
                          this.router.navigate(['/event-list']); // 保存成功后跳转
                      },
                      (error) => {
                          console.error('Error saving entry rules:', error);
                          alert('Entry rules save failed. Please try again');
                      }
                  );
              } else {
                  alert('Ticket prices saved successfully! ✅');
                  this.router.navigate(['/event-list']); // 保存成功后跳转
              }
          },
          error: (error) => {
              console.error('Error saving ticket prices:', error);
              alert('Ticket prices save failed. Please try again');
          }
      });
    }
  
    // 读取座位数据
    loadSeats() {
      if (this.eventId) {
        const savedData = localStorage.getItem(`seats_${this.eventId}`);
        if (savedData) {
          this.seats = JSON.parse(savedData);
          this.updatePriceSummary();
          this.updatePriceMessages();
        }
      }
    }

    updatePriceSummary() {
        this.priceSummary = {};
        this.seats.flat().forEach(seat => {
          if (seat.confirmed && seat.price !== null) {
            this.priceSummary[seat.zoneColor] = seat.price;
          }
        });
      }
  
    backToEventList() {
      this.router.navigate(['/event-list']); 
    }

    selectSeat(rowIndex: number, colIndex: number) {
      const seatId = `${rowIndex}-${colIndex}`;
      const index = this.selectedSeats.indexOf(seatId);
      
      if (index === -1) {
        this.selectedSeats.push(seatId);
      } else {
        this.selectedSeats.splice(index, 1);
      }
    }

    // 加载现有票价信息
    loadExistingTickets() {
      if (this.eventId) {
        console.log('Loading ticket prices for event:', this.eventId);
        this.ticketService.getTicketPrices(this.eventId).subscribe({
          next: (response) => {
            console.log('Received ticket prices:', response);
            if (response && response.zonePrices) {
              // 将已保存的价格加载到 priceSummary 中
              response.zonePrices.forEach((price: ZonePrice) => {
                this.priceSummary[price.color] = price.price;
              });
              // 更新座位价格
              this.seats.forEach(row => {
                row.forEach(seat => {
                  if (this.priceSummary[seat.zoneColor]) {
                    seat.price = this.priceSummary[seat.zoneColor];
                  }
                });
              });
              // 更新价格信息显示
              this.updatePriceMessages();
            } else {
              console.log('No zone prices found in response');
            }
          },
          error: (error) => {
            console.error('Error loading ticket prices:', error);
          }
        });

        // 加载入场规则
        this.eventService.getEventById(this.eventId).subscribe({
          next: (event) => {
            console.log('Loaded event data:', event);
            if (event && event.entryRules) {
              this.entryRules = event.entryRules;
            }
          },
          error: (error) => {
            console.error('Error loading event data:', error);
          }
        });
      }
    }

    // 当设置区域价格时
    setZonePrice() {
      if (!this.selectedZone || !this.zonePrice) {
        this.message = 'Please select a zone and enter a price';
        return;
      }

      // 检查是否已经设置了该区域的价格
      const existingZoneIndex = this.zonePrices.findIndex(
        zone => zone.zoneName === this.selectedZone
      );

      if (existingZoneIndex !== -1) {
        // 更新现有价格
        this.zonePrices[existingZoneIndex].price = this.zonePrice;
      } else {
        // 添加新的价格
        this.zonePrices.push({
          zoneName: this.selectedZone,
          price: this.zonePrice,
          color: this.selectedZone.toLowerCase() // 获取对应的颜色类名
        });
      }

      // 清除输入
      this.selectedZone = '';
      this.zonePrice = 0;
      this.message = 'Price set successfully!';
    }

    // Get zone display name from color
    getZoneName(color: string): string {
      return this.colorToZoneName[color] || color;
    }

    // Handle seat selection for pricing
    selectSeatForPricing(zoneColor: string) {
      if (zoneColor !== 'black') {
        this.selectedZoneColor = zoneColor;
        this.selectedPrice = this.priceSummary[zoneColor] || null;
      }
    }

    openEntryRulesDialog() {
        this.showEntryRulesDialog = true;
    }

    closeEntryRulesDialog() {
        this.showEntryRulesDialog = false;
    }

    saveEntryRules() {
        if (!this.eventId) {
            console.error('No event ID found');
            return;
        }
        
        this.eventService.updateEvent(this.eventId, { entryRules: this.entryRules }).subscribe(
            (response: any) => {
                console.log('Entry rules saved successfully');
                alert('Entry rules saved successfully!');
                this.closeEntryRulesDialog();
            },
            (error: any) => {
                console.error('Error saving entry rules:', error);
                alert('Failed to save entry rules. Please try again.');
            }
        );
    }
  }
  
