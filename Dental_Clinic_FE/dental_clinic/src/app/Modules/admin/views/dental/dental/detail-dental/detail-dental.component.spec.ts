import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDentalComponent } from './detail-dental.component';

describe('DetailDentalComponent', () => {
  let component: DetailDentalComponent;
  let fixture: ComponentFixture<DetailDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
