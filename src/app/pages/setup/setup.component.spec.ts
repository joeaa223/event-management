import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpComponent } from './setup.component';

describe('SetUpComponent', () => {
  let component: SetUpComponent;
  let fixture: ComponentFixture<SetUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
