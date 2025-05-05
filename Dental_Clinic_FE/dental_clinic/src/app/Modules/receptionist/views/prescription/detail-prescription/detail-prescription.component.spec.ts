import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPrescriptionComponent } from './detail-prescription.component';

describe('DetailPrescriptionComponent', () => {
  let component: DetailPrescriptionComponent;
  let fixture: ComponentFixture<DetailPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
