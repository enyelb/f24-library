// column-token.ts
import { InjectionToken } from '@angular/core';
import { MatColumnDef, MatFooterRowDef, MatHeaderRowDef } from '@angular/material/table';

import { F24Column } from './components/column/column';

/**
 * F24_COLUMN_DEF_TOKEN
 */
export const F24_COLUMN_DEF_TOKEN = new InjectionToken<MatColumnDef | F24Column>('F24_COLUMN_DEF_TOKEN');

/**
 * F24_HEADER_ROW_DEF_TOKEN
 */
export const F24_HEADER_ROW_DEF_TOKEN = new InjectionToken<MatHeaderRowDef | F24Column>('F24_HEADER_ROW_DEF_TOKEN');

/**
 * F24_FOOTER_ROW_DEF_TOKEN
 */
export const F24_FOOTER_ROW_DEF_TOKEN = new InjectionToken<MatFooterRowDef | F24Column>('F24_FOOTER_ROW_DEF_TOKEN');

/**
 * F24_SHORT_HEADER_TOKEN
 */
export const F24_SHORT_HEADER_TOKEN = new InjectionToken<F24Column>('F24_SHORT_HEADER_TOKEN');