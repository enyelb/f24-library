import {Component} from '@angular/core';

import { F24Copy } from "@f24/layout";

@Component({
  selector: 'f24-copy-demo',
  template: `
    <f24-copy [text]="text" [copy]="copy"/>
  `,
  imports: [F24Copy],
})
export class F24CopyDemo {

  readonly text = 'Show text';
  readonly copy = 'Copy text'
}
