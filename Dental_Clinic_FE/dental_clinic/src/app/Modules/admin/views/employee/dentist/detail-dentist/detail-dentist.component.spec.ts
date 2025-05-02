import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDentistComponent } from './detail-dentist.component';

describe('DetailDentistComponent', () => {
  let component: DetailDentistComponent;
  let fixture: ComponentFixture<DetailDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
