import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrescriptionComponent } from './edit-prescription.component';

describe('EditPrescriptionComponent', () => {
  let component: EditPrescriptionComponent;
  let fixture: ComponentFixture<EditPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
