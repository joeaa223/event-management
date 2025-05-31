import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainpageAttendeesComponent } from './mainpage-attendees.component';

describe('MainpageAttendeesComponent', () => {
  let component: MainpageAttendeesComponent;
  let fixture: ComponentFixture<MainpageAttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainpageAttendeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainpageAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
