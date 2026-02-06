import { NgModule } from '@angular/core';

import { F24CurrencyPipe } from './pipes/currency-pipe';
import { F24DateDifPipe, F24DatePipe } from './pipes/date-pipe';
import { F24ToNumberPipe } from './pipes/number-pipe';
import { F24RoundPipe } from './pipes/round-pipe';
import { F24ToUSDPipe } from './pipes/to-usd-pipe';
import { F24ToBSPipe } from './pipes/to-ves-pipe';
import { F24AbsPipe } from './pipes/abs-pipe';

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
    F24ToBSPipe,
    F24AbsPipe,
  ],
  exports: [
    F24CurrencyPipe,
    F24DateDifPipe,
    F24DatePipe,
    F24RoundPipe,
    F24ToNumberPipe,
    F24ToUSDPipe,
    F24ToBSPipe,
    F24AbsPipe,
  ]
})
export class F24FunctionsModule { }
