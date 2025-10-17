import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiserWalletComponent } from './advertiser-wallet.component';

describe('AdvertiserWalletComponent', () => {
  let component: AdvertiserWalletComponent;
  let fixture: ComponentFixture<AdvertiserWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertiserWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertiserWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
