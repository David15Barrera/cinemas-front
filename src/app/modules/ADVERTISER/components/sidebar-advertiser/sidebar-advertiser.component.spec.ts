import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdvertiserComponent } from './sidebar-advertiser.component';

describe('SidebarAdvertiserComponent', () => {
  let component: SidebarAdvertiserComponent;
  let fixture: ComponentFixture<SidebarAdvertiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAdvertiserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarAdvertiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
