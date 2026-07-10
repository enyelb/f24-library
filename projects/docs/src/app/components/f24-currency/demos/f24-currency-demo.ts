import {Component} from '@angular/core';

import { F24Currency } from "@f24/layout";

@Component({
  selector: 'f24-currency-demo',
  template: `
    <f24-currency [label]="label" [ves]="ves" [usd]="usd"/>
  `,
  imports: [F24Currency],
})
export class F24CurrencyDemo {

  readonly label = 'Monto total';
  readonly ves = 700;
  readonly usd = 1;
}
