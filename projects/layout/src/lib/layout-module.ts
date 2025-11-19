import { NgModule } from '@angular/core';

import { Lazy } from './lazy';
import { Loader } from './loader';
import { ResponsiveView } from './responsive-view';
import { Container } from './container';
import { F24ColDirective, F24RowDirective } from './directives';



@NgModule({
  imports: [
    Lazy,
    Loader,
    ResponsiveView,
    Container,
    F24ColDirective,
    F24RowDirective
  ],
  exports: [
    Lazy,
    Loader,
    ResponsiveView,
    Container,
    F24ColDirective,
    F24RowDirective
  ]
})
export class LayoutModule { }
