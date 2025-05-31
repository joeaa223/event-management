import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrganizerHomeComponent } from './event-organizer-home.component';

describe('EventOrganizerHomeComponent', () => {
  let component: EventOrganizerHomeComponent;
  let fixture: ComponentFixture<EventOrganizerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventOrganizerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventOrganizerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
