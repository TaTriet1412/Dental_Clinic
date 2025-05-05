import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultUiComponent } from './default-ui.component';

describe('DefaultUiComponent', () => {
  let component: DefaultUiComponent;
  let fixture: ComponentFixture<DefaultUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
