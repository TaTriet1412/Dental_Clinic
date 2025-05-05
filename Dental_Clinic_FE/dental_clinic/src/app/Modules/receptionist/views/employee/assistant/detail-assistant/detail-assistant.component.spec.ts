import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAssistantComponent } from './detail-assistant.component';

describe('DetailAssistantComponent', () => {
  let component: DetailAssistantComponent;
  let fixture: ComponentFixture<DetailAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAssistantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
