import { NgModule } from '@angular/core';

import { Lazy } from './lazy';
import { Loader } from './loader';
import { ResponsiveView } from './responsive-view';
import { Container } from './container';



@NgModule({
  imports: [
    Lazy,
    Loader,
    ResponsiveView,
    Container
  ],
  exports: [
    Lazy,
    Loader,
    ResponsiveView,
    Container
  ]
})
export class LayoutModule { }
