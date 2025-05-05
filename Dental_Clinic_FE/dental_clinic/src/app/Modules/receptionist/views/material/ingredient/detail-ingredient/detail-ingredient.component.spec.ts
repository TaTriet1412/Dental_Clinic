import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailIngredientComponent } from './detail-ingredient.component';

describe('DetailIngredientComponent', () => {
  let component: DetailIngredientComponent;
  let fixture: ComponentFixture<DetailIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailIngredientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
