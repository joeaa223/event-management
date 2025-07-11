import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOrganizerComponent } from './register-organizer.component';

describe('RegisterOrganizerComponent', () => {
  let component: RegisterOrganizerComponent;
  let fixture: ComponentFixture<RegisterOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterOrganizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});