import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsumableMaterialComponent } from './detail-consumable-material.component';

describe('DetailConsumableMaterialComponent', () => {
  let component: DetailConsumableMaterialComponent;
  let fixture: ComponentFixture<DetailConsumableMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailConsumableMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailConsumableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
