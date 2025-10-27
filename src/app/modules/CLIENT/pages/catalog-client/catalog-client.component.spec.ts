import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogClientComponent } from './catalog-client.component';

describe('CatalogClientComponent', () => {
  let component: CatalogClientComponent;
  let fixture: ComponentFixture<CatalogClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
