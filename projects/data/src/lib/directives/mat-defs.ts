import { Directive, inject } from '@angular/core';

import { MatSortHeader } from '@angular/material/sort';
import { MatColumnDef } from '@angular/material/table';

import { F24_COLUMN_DEF_TOKEN, F24_SHORT_HEADER_TOKEN } from '../column-token';


/**
 * MatColumnDefDirective
 */
@Directive({
  selector: '[matColumnDef]',
  standalone: true,
  providers: [
    {
      provide: F24_COLUMN_DEF_TOKEN,
      useFactory: () => {
        return inject(MatColumnDef);
      }
    }
  ]
})
export class MatColumnDefDirective {}

/**
 * MatShortHeaderDirective
 */
@Directive({
  selector: '[matShortHeader]',
  standalone: true,
  providers: [
    {
      provide: F24_SHORT_HEADER_TOKEN,
      useFactory: () => {
        return inject(MatSortHeader);
      }
    }
  ]
})
export class MatShortHeaderDirective {}

