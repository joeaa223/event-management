import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    google: {
      payments: {
        api: {
          PaymentsClient: new (config: any) => any;
        }
      }
    }
  }
}

interface BankOption {
  id: string;
  name: string;
  icon: string;
}

interface PaymentSeat {
  row: string;
  col: number;
}

@Component({
  selector: 'app-online-banking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './online-banking.component.html',
  styleUrls: ['./online-banking.component.css']
})
export class OnlineBankingComponent implements OnInit {
  amount: number = 0;
  eventId: string = '';
  eventName: string = '';
  selectedSeats: PaymentSeat[] = [];
  selectedBank: string | null = null;
  email: string = '';
  emailError: string = '';
  paymentsClient: any;

  get seats(): string {
    return this.selectedSeats.map(seat => `${seat.row}${seat.col}`).join(', ');
  }

  bankOptions: BankOption[] = [
    { id: 'maybank', name: 'Maybank2u', icon: 'fas fa-university' },
    { id: 'cimb', name: 'CIMB Clicks', icon: 'fas fa-university' },
    { id: 'public', name: 'Public Bank', icon: 'fas fa-university' },
    { id: 'rhb', name: 'RHB Now', icon: 'fas fa-university' },
    { id: 'hong_leong', name: 'Hong Leong Connect', icon: 'fas fa-university' },
    { id: 'ambank', name: 'AmOnline', icon: 'fas fa-university' }
  ];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.amount = navigation.extras.state['amount'] || 0;
      this.eventId = navigation.extras.state['eventId'] || '';
      this.eventName = navigation.extras.state['eventName'] || '';
      this.selectedSeats = navigation.extras.state['selectedSeats'] || [];
    }
  }

  ngOnInit(): void {
    if (!this.amount || !this.eventId || !this.selectedSeats.length) {
      console.error('Missing required payment information');
      this.router.navigate(['/event-check']);
      return;
    }

    // 初始化 Google Pay
    this.initializeGooglePay();
  }

  private initializeGooglePay() {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = () => this.createGooglePayClient();
      document.head.appendChild(script);
    } else {
      this.createGooglePayClient();
    }
  }

  private createGooglePayClient() {
    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0
    };

    const allowedPaymentMethods = [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA']
      }
    }];

    this.paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST'
    });

    this.paymentsClient.isReadyToPay({
      ...baseRequest,
      allowedPaymentMethods
    })
    .then((response: any) => {
      if (response.result) {
        const button = this.paymentsClient.createButton({
          onClick: () => this.processGooglePayPayment(),
          buttonColor: 'black',
          buttonType: 'pay'
        });
        document.getElementById('google-pay-button')?.appendChild(button);
      }
    })
    .catch((err: any) => {
      console.error('Google Pay initialization error:', err);
    });
  }

  async processGooglePayPayment() {
    try {
      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId'
            }
          }
        }],
        merchantInfo: {
          merchantId: '12345678901234567890',
          merchantName: 'Example Merchant'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: this.amount.toString(),
          currencyCode: 'MYR',
          countryCode: 'MY'
        }
      };

      const paymentData = await this.paymentsClient.loadPaymentData(paymentDataRequest);
      
      // 发送支付数据到后端
      const response = await fetch('https://event-management-production-ec59.up.railway.app/api/payments/online-banking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: this.eventId,
          eventName: this.eventName,
          seats: this.selectedSeats.map(seat => ({
            row: seat.row,
            col: seat.col
          })),
          amount: this.amount,
          email: this.email,
          selectedBank: 'GOOGLE_PAY'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }

      const result = await response.json();
      console.log('Payment result:', result);

      // 清除本地存储中的支付相关数据
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('payment')) {
          localStorage.removeItem(key);
        }
      });

      alert('Payment successful!');
      this.router.navigate(['/event-check']);
    } catch (err: any) {
      console.error('Payment failed:', err);
      if (err.statusCode === 'CANCELED') {
        alert('Payment was canceled');
      } else if (err.statusCode === 'DEVELOPER_ERROR') {
        alert('Configuration error. Please contact support.');
      } else {
        alert(err.message || 'Payment failed. Please try again.');
      }
    }
  }

  selectBank(bankId: string): void {
    this.selectedBank = bankId;
    console.log('Selected bank:', bankId);
  }

  validateEmailInput() {
    this.emailError = '';
    if (!this.email) {
      return;
    }
    if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  processOnlineBankingPayment(): void {
    // 重置错误信息
    this.emailError = '';

    if (!this.selectedBank) {
      alert('Please select a bank to proceed');
      return;
    }

    if (!this.email) {
      this.emailError = 'Please enter your email address';
      alert(this.emailError);
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      alert(this.emailError);
      return;
    }

    const paymentData = {
      eventId: this.eventId,
      eventName: this.eventName,
      seats: this.selectedSeats.map(seat => ({
        row: seat.row,
        col: seat.col
      })),
      amount: this.amount,
      email: this.email,
      selectedBank: this.selectedBank
    };

    console.log('Sending payment data:', paymentData);

    fetch('https://event-management-production-ec59.up.railway.app/api/payments/online-banking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Payment failed');
      }
      return response.json();
    })
    .then(data => {
      console.log('Payment successful:', data);
      alert('Payment successful!');
      // 清除本地存储中的支付相关数据
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('payment')) {
          localStorage.removeItem(key);
        }
      });
      this.router.navigate(['/event-check']);
    })
    .catch(error => {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    });
  }

  goBack(): void {
    this.router.navigate(['/payment']);
  }
}

