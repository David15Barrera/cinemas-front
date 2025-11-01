import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReviewsRoomComentComponent } from './report-reviews-room-coment.component';

describe('ReportReviewsRoomComentComponent', () => {
  let component: ReportReviewsRoomComentComponent;
  let fixture: ComponentFixture<ReportReviewsRoomComentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportReviewsRoomComentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReviewsRoomComentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
