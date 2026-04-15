// column-token.ts
import { InjectionToken } from '@angular/core';

import { F24Column } from './components/column/column';
import { F24ColumnSelect } from './components/column-select/column-select';

/**
 * F24_COLUMN_DEF_TOKEN
 */
export const F24_COLUMN_DEF_TOKEN = new InjectionToken<F24Column | F24ColumnSelect<any>>('F24_COLUMN_DEF_TOKEN');