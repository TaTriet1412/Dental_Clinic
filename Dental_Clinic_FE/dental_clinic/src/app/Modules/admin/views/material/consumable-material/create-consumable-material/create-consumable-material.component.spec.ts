import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConsumableMaterialComponent } from './create-consumable-material.component';

describe('CreateConsumableMaterialComponent', () => {
  let component: CreateConsumableMaterialComponent;
  let fixture: ComponentFixture<CreateConsumableMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateConsumableMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateConsumableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
