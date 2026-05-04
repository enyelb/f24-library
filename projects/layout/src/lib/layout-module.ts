import { NgModule } from '@angular/core';

import { F24Lazy } from './components/lazy/lazy';
import { F24Loader } from './components/loader/loader';
import { F24ResponsiveView } from './components/responsive-view/responsive-view';
import { F24Container } from './components/container/container';
import { F24Currency } from './components/currency/currency';
import { F24Quantity } from './components/quantity/quantity';
import { F24Description } from './components/description/description';
import { F24Image } from './components/image/image';
import { F24Status } from './components/status/status';
import { F24Icon } from './components/icon/icon';
import { F24Copy } from './components/copy/copy';
import { F24Divider } from './components/divider/divider';

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
    F24Quantity,
    F24Description,
    F24Image,
    F24Status,
    F24Icon,
    F24Copy,
    F24Divider,
    F24ColDirective,
    F24RowDirective
  ],
  exports: [
    F24Lazy,
    F24Loader,
    F24ResponsiveView,
    F24Container,
    F24Currency,
    F24Quantity,
    F24Description,
    F24Image,
    F24Status,
    F24Icon,
    F24Copy,
    F24Divider,
    F24ColDirective,
    F24RowDirective
  ]
})
export class F24LayoutModule { }
