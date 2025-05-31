import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { EventOrganizerHomeComponent } from './pages/event-organizer-home/event-organizer-home.component';
import { MainpageAttendeesComponent } from './pages/mainpage-attendees/mainpage-attendees.component';
import { AnalyticReportComponent } from './pages/analytic-report/analytic-report.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { OrganizerService } from './services/organizer.service';

@NgModule({
  declarations: [
    AppComponent,
    MainpageAttendeesComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    AnalyticReportComponent,
    EventOrganizerHomeComponent,
    HomeComponent
  ],
  providers: [OrganizerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
