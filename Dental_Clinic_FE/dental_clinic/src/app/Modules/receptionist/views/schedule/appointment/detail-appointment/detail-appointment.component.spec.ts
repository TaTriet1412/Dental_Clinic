import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAppointmentComponent } from './detail-appointment.component';

describe('DetailAppointmentComponent', () => {
  let component: DetailAppointmentComponent;
  let fixture: ComponentFixture<DetailAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
