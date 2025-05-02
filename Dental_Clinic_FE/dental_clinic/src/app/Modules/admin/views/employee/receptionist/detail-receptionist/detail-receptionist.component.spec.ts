import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReceptionistComponent } from './detail-receptionist.component';

describe('DetailReceptionistComponent', () => {
  let component: DetailReceptionistComponent;
  let fixture: ComponentFixture<DetailReceptionistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailReceptionistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailReceptionistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
