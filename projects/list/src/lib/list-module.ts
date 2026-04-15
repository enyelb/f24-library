import { NgModule } from '@angular/core';


import { F24List } from './components/list/list';
import { F24ItemTemplateOne } from './components/item-template-one/item-template-one';

import { F24ListItem } from './directives/list-item';

/**
 * F24ListModule
 */
@NgModule({
  declarations: [],
  imports: [
    F24List,
    F24ItemTemplateOne,
    F24ListItem,
  ],
  exports: [
    F24List,
    F24ItemTemplateOne,
    F24ListItem,
  ]
})
export class F24ListModule { }
