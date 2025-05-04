import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFixedMaterialComponent } from './create-fixed-material.component';

describe('CreateFixedMaterialComponent', () => {
  let component: CreateFixedMaterialComponent;
  let fixture: ComponentFixture<CreateFixedMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFixedMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFixedMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
