import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNoScroll } from './table-no-scroll';

describe('TableNoScroll', () => {
  let component: TableNoScroll;
  let fixture: ComponentFixture<TableNoScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableNoScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableNoScroll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
