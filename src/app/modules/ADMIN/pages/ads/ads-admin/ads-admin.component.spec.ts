import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsAdminComponent } from './ads-admin.component';

describe('AdsAdminComponent', () => {
  let component: AdsAdminComponent;
  let fixture: ComponentFixture<AdsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
