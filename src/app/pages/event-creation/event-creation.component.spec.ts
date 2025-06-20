import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreationComponent } from './event-creation.component';

describe('EventCreationComponent', () => {
  let component: EventCreationComponent;
  let fixture: ComponentFixture<EventCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});