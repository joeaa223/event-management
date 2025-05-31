import { Routes } from '@angular/router';
import { SetUpComponent } from './pages/setup/setup.component';
import { BookingComponent } from './pages/booking/booking.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { WaitlistComponent } from './pages/waitlist/waitlist.component';
import { LoginComponent } from './pages/Login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterOrganizerComponent } from './pages/register-organizer/register-organizer.component';
import { EventCreationComponent } from './pages/event-creation/event-creation.component';
import { EventListComponent } from './pages/event-list/event-list.component';
import { DefineTicketComponent } from './pages/define-ticket/define-ticket.component';
import { LoginOrganizer } from './pages/log-event-organizer/log-event-organizer.component';
import { EventOrganizerHomeComponent } from './pages/event-organizer-home/event-organizer-home.component';
import { MainpageAttendeesComponent } from './pages/mainpage-attendees/mainpage-attendees.component';
import { EventCheckComponent } from './pages/event-check/event-check.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { AnalyticReportComponent } from './pages/analytic-report/analytic-report.component';
import { OnlineBankingComponent } from './pages/online-banking/online-banking.component';
import { AdminAnalyticComponent } from './pages/admin-analytic/admin-analytic.component';

export const routes: Routes = [
  // Default route - changed to event-check
  { path: '', redirectTo: 'event-check', pathMatch: 'full' },

  // Auth-related routes
  { path: 'login', component: LoginComponent },
  { path: 'register-organizer', component: RegisterOrganizerComponent },
  { path: 'log-event-organizer', component: LoginOrganizer },

  // Event-related routes
  { path: 'event-list', component: EventListComponent },
  { path: 'event-details/:id', component: EventDetailsComponent },
  { path: 'event-creation', component: EventCreationComponent },
  { path: 'define-ticket/:eventId', component: DefineTicketComponent },
  { path: 'event-check', component: EventCheckComponent },

  // Payment-related routes
  { path: 'booking/:id', component: BookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'online-banking', component: OnlineBankingComponent },

  // Other page routes
  { path: 'setup', component: SetUpComponent },
  { path: 'waitlist', component: WaitlistComponent },
  { path: 'home', component: HomeComponent },
  { path: 'event-organizer-home', component: EventOrganizerHomeComponent },
  { path: 'mainpage-attendees', component: MainpageAttendeesComponent },
  { path: 'analytic-report', component: AnalyticReportComponent },
  { path: 'admin-analytic', component: AdminAnalyticComponent }
];