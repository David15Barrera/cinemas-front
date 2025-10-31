import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAdsComponent } from './report-ads.component';

describe('ReportAdsComponent', () => {
  let component: ReportAdsComponent;
  let fixture: ComponentFixture<ReportAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportAdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
