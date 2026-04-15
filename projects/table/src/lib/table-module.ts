import { NgModule } from '@angular/core';

import { F24Table } from './components/table/table';
import { F24Column } from './components/column/column';
import { F24ColumnSelect } from './components/column-select/column-select';

import { F24CellDirective } from './directives/cell';
import { F24HeaderDirective } from './directives/header';
import { F24FooterDirective } from './directives/footer';

/**
 * DataModule
 */
@NgModule({
  declarations: [],
  imports: [
    F24Table,
    F24Column,
    F24ColumnSelect,
    F24CellDirective,
    F24HeaderDirective,
    F24FooterDirective,
  ],
  exports: [
    F24Table,
    F24Column,
    F24ColumnSelect,
    F24CellDirective,
    F24HeaderDirective,
    F24FooterDirective,
  ]
})
export class F24TableModule { }
