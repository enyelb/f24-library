import { NgModule } from '@angular/core';

import { Lazy } from './lazy';
import { Loader } from './loader';
import { ResponsiveView } from './responsive-view';
import { Container } from './container';
import { Currency } from './currency';
import { Description } from './description';

import { F24ColDirective, F24RowDirective } from './directives';

/**
 * LayoutModule
 */
@NgModule({
  imports: [
    Lazy,
    Loader,
    ResponsiveView,
    Container,
    Currency,
    Description,
    F24ColDirective,
    F24RowDirective
  ],
  exports: [
    Lazy,
    Loader,
    ResponsiveView,
    Container,
    Currency,
    Description,
    F24ColDirective,
    F24RowDirective
  ]
})
export class LayoutModule { }
