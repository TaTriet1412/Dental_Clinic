import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerError500Component } from './server-error-500.component';

describe('ServerError500Component', () => {
  let component: ServerError500Component;
  let fixture: ComponentFixture<ServerError500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerError500Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerError500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
