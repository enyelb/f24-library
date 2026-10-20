import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputRadio } from './input-radio';

describe('InputRadio', () => {
  let component: InputRadio;
  let fixture: ComponentFixture<InputRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputRadio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputRadio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
