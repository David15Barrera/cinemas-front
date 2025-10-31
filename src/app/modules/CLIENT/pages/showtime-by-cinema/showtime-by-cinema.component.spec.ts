import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowtimeByCinemaComponent } from './showtime-by-cinema.component';

describe('ShowtimeByCinemaComponent', () => {
  let component: ShowtimeByCinemaComponent;
  let fixture: ComponentFixture<ShowtimeByCinemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowtimeByCinemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowtimeByCinemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
