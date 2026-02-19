import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPhone } from './input-phone';

describe('InputPhone', () => {
  let component: InputPhone;
  let fixture: ComponentFixture<InputPhone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPhone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputPhone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
