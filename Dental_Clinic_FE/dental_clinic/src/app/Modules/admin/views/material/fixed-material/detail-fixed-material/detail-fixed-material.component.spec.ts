import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFixedMaterialComponent } from './detail-fixed-material.component';

describe('DetailFixedMaterialComponent', () => {
  let component: DetailFixedMaterialComponent;
  let fixture: ComponentFixture<DetailFixedMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailFixedMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFixedMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
