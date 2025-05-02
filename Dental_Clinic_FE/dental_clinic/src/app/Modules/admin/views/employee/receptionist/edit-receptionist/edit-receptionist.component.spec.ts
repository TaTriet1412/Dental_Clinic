import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceptionistComponent } from './edit-receptionist.component';

describe('EditReceptionistComponent', () => {
  let component: EditReceptionistComponent;
  let fixture: ComponentFixture<EditReceptionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReceptionistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
