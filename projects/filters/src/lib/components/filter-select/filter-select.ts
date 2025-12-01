import { Component, EventEmitter, input, Input, OnDestroy, OnInit, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';

import { Subscription } from 'rxjs';

/**
 * F24FilterSelectComponent
 */
@Component({
  selector: 'f24-filter-select',
  styleUrls: ['filter-select.scss'],
  templateUrl: 'filter-select.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MtxSelectModule],
})
export class F24FilterSelect<Data> implements OnInit, OnDestroy {

  /**
   * id
   */
  readonly id = input('');

  /**
   * label
   */
  readonly label = input('Filter');

  /**
   * multiple
   */
  readonly multiple = input(false);

  /**
   * dafault
   */
  readonly default = input<any>(null);

  /**
   * bindLabel
   */
  readonly bindLabel = input<string>();

  /**
   * bindValue
   */
  readonly bindValue = input<string>();

  /**
   * form
   */
  readonly form = input(new FormControl(this.default()));

  /**
   * items
   */
  readonly items = input<Data[]>([]);

   /**
   * appearance
   */
  readonly appearance = input<'fill' | 'outline'>('outline');

  /**
   * change
   */
  readonly change = output<any>();

  /**
   * subscription
   */
  private subscription? : Subscription;

  /**
   * formatterLabel
   */
  readonly formatterLabel = input((data: Data) => {
    if (this.bindLabel() && data != null && (data instanceof Object)) {
      for(const [key, value] of Object.entries(data)) {
        if (key === this.bindLabel()) {
          return value;
        }
      }
    }
    return data;
  });

  /**
   * formatterOption
   */
  readonly formatterOption = input((data: Data) => {
    if (this.bindLabel() && data != null && (data instanceof Object)) {
      for(const [key, value] of Object.entries(data)) {
        if (key === this.bindLabel()) {
          return value;
        }
      }
    }
    return data;
  });

  /**
   * ngOnInit
   */
  ngOnInit() {
    if (this.id()) {
      const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');

      if (filters[this.id()]) {
        this.form().setValue(filters[this.id()]);
      }
    }

    this.subscription = this.form().valueChanges.subscribe(value => {
      this.change.emit(value);

      if (this.id()) {
        const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
        filters[this.id()] = value;
        localStorage.setItem("filters", JSON.stringify(filters));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
