import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesAdminComponent } from './movies-admin.component';

describe('MoviesAdminComponent', () => {
  let component: MoviesAdminComponent;
  let fixture: ComponentFixture<MoviesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
