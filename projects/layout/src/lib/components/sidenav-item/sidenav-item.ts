import { Component, input, output, signal, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

import { timer } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { F24Icon } from '../icon/icon';
import { F24SidenavRouteSourceParams, F24SidenavSourceParams } from '../sidenav/sidenav-source';

/**
 * F24SidenavItem
 */
@Component({
  selector: 'f24-sidenav-item',
  imports: [
    RouterModule,
    MatButtonModule, MatIconModule, MatListModule,
    F24Icon
  ],
  templateUrl: './sidenav-item.html',
  styleUrl: './sidenav-item.scss',
  encapsulation: ViewEncapsulation.None,
})
export class F24SidenavItem {
  /**
   * inputs
   */
  readonly route = input.required<F24SidenavRouteSourceParams>();
  readonly allowExpandedMultiple = input<F24SidenavSourceParams['allowExpandedMultiple']>();
  /**
   * signals
   */
  readonly expanded = signal(false);
  readonly hasChildrenItemActive = signal(false);
  /**
   * output
   */
  readonly changeItem = output<boolean>();
  readonly changeExpanded = output();
  readonly changeCollapsed = output();
  readonly activateChildrenItem = output<boolean>();
  /**
   * setExpanded
   */
   setExpanded(expanded: boolean): void {
    this.expanded.set(expanded);
   }
  /**
   * change
   */
  protected change(expanded: boolean): void {
    this.changeItem.emit(expanded);
    if(expanded) {
      this.changeExpanded.emit();
    } else {
      this.changeCollapsed.emit();
    }
    this.expanded.set(expanded);
  }
  /**
   * changeChildrenItemActive
   */
  protected changeChildrenItemActive(activate: boolean): void {
    this.hasChildrenItemActive.set(activate);
    if (activate && !this.expanded()) {
      this.expanded.set(true);
    }
  }
  /**
   * updateParentItem
   */
  protected updateParentItem(event: boolean): void {
    if (event) {
      timer(0).subscribe(e => {
        this.activateChildrenItem.emit(event);
      });
    } else {
      this.activateChildrenItem.emit(event);
    }
  }
}
