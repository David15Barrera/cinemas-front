import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCinemaComponent } from './dashboard-cinema.component';

describe('DashboardCinemaComponent', () => {
  let component: DashboardCinemaComponent;
  let fixture: ComponentFixture<DashboardCinemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCinemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCinemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
