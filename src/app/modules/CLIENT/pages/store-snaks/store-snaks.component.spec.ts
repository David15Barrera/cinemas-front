import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSnaksComponent } from './store-snaks.component';

describe('StoreSnaksComponent', () => {
  let component: StoreSnaksComponent;
  let fixture: ComponentFixture<StoreSnaksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSnaksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreSnaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
