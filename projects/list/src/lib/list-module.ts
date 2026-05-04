import { NgModule } from '@angular/core';


import { F24List } from './components/list/list';
import { F24ItemTemplateOne } from './components/item-template-one/item-template-one';
import { F24ItemTemplateTwo } from './components/item-template-two/item-template-two';

import { F24ListItem } from './directives/list-item';

/**
 * F24ListModule
 */
@NgModule({
  declarations: [],
  imports: [
    F24List,
    F24ItemTemplateOne,
    F24ItemTemplateTwo,
    F24ListItem,
  ],
  exports: [
    F24List,
    F24ItemTemplateOne,
    F24ItemTemplateTwo,
    F24ListItem,
  ]
})
export class F24ListModule { }
