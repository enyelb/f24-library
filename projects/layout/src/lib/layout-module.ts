import { NgModule } from '@angular/core';

import { F24Lazy } from './components/lazy/lazy';
import { F24Loader } from './components/loader/loader';
import { F24ResponsiveView } from './components/responsive-view/responsive-view';
import { F24Container } from './components/container/container';
import { F24Currency } from './components/currency/currency';
import { F24Description } from './components/description/description';

import { F24ColDirective } from './directives/col-directive';
import { F24RowDirective } from './directives/row-directive';


/**
 * LayoutModule
 */
@NgModule({
  imports: [
    F24Lazy,
    F24Loader,
    F24ResponsiveView,
    F24Container,
    F24Currency,
    F24Description,
    F24ColDirective,
    F24RowDirective
  ],
  exports: [
    F24Lazy,
    F24Loader,
    F24ResponsiveView,
    F24Container,
    F24Currency,
    F24Description,
    F24ColDirective,
    F24RowDirective
  ]
})
export class F24LayoutModule { }
