import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPhone } from './form-phone';

describe('FormPhone', () => {
  let component: FormPhone;
  let fixture: ComponentFixture<FormPhone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPhone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPhone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
