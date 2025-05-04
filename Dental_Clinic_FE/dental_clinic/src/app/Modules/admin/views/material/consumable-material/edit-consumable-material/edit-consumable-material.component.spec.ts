import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsumableMaterialComponent } from './edit-consumable-material.component';

describe('EditConsumableMaterialComponent', () => {
  let component: EditConsumableMaterialComponent;
  let fixture: ComponentFixture<EditConsumableMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConsumableMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConsumableMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
