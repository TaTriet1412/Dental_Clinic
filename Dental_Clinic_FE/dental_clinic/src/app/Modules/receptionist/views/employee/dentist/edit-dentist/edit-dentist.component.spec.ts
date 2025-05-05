import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDentistComponent } from './edit-dentist.component';

describe('EditDentistComponent', () => {
  let component: EditDentistComponent;
  let fixture: ComponentFixture<EditDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
