import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedMaterialComponent } from './fixed-material.component';

describe('FixedMaterialComponent', () => {
  let component: FixedMaterialComponent;
  let fixture: ComponentFixture<FixedMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
