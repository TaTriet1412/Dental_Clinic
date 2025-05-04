import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDentalComponent } from './create-dental.component';

describe('CreateDentalComponent', () => {
  let component: CreateDentalComponent;
  let fixture: ComponentFixture<CreateDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
