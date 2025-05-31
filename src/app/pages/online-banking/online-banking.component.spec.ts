import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBankingComponent } from './online-banking.component';

describe('OnlineBankingComponent', () => {
  let component: OnlineBankingComponent;
  let fixture: ComponentFixture<OnlineBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnlineBankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
