import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFixedMaterialComponent } from './edit-fixed-material.component';

describe('EditFixedMaterialComponent', () => {
  let component: EditFixedMaterialComponent;
  let fixture: ComponentFixture<EditFixedMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFixedMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFixedMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
