// column-token.ts
import { InjectionToken } from '@angular/core';
import { MatColumnDef } from '@angular/material/table';
import { MatSortHeader } from '@angular/material/sort';

import { F24Column } from './components/column/column';
import { F24ColumnSelect } from './components/column-select/column-select';

/**
 * F24_COLUMN_DEF_TOKEN
 */
export const F24_COLUMN_DEF_TOKEN = new InjectionToken<MatColumnDef | F24Column | F24ColumnSelect<any>>('F24_COLUMN_DEF_TOKEN');

/**
 * F24_SHORT_HEADER_TOKEN
 */
export const F24_SHORT_HEADER_TOKEN = new InjectionToken<MatSortHeader | F24Column>('F24_SHORT_HEADER_TOKEN');