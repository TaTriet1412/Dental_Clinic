import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDentalComponent } from './edit-dental.component';

describe('EditDentalComponent', () => {
  let component: EditDentalComponent;
  let fixture: ComponentFixture<EditDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
