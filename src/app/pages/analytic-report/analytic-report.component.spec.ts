import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticReportComponent } from './analytic-report.component';

describe('AnalyticReportComponent', () => {
  let component: AnalyticReportComponent;
  let fixture: ComponentFixture<AnalyticReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
