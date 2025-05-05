import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumableMaterialComponent } from './consumable-material.component';

describe('ConsumableMaterialComponent', () => {
  let component: ConsumableMaterialComponent;
  let fixture: ComponentFixture<ConsumableMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumableMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
