import { NgModule } from '@angular/core';

import {
  F24CurrencyPipe, 
  F24DateDifPipe,
  F24DatePipe,
  F24RoundPipe,
  F24ToNumberPipe,
  F24ToUSDPipe,
  F24ToBSPipe
} from './pipes';

/**
 * FunctionsModule
 */
@NgModule({
  imports: [
    F24CurrencyPipe,
    F24DateDifPipe,
    F24DatePipe,
    F24RoundPipe,
    F24ToNumberPipe,
    F24ToUSDPipe,
    F24ToBSPipe
  ],
  exports: [
    F24CurrencyPipe,
    F24DateDifPipe,
    F24DatePipe,
    F24RoundPipe,
    F24ToNumberPipe,
    F24ToUSDPipe,
    F24ToBSPipe
  ]
})
export class FunctionsModule { }
