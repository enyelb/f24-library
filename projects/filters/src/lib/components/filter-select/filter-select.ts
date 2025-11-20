import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class F24FilterSelect<Data, Type> implements OnInit, OnDestroy {

  /**
   * id
   */
  @Input() id : string = '';

  /**
   * label
   */
  @Input() label: string = 'Filter';

  /**
   * multiple
   */
  @Input() multiple: boolean = false;

  /**
   * dafault
   */
  @Input() default: Type | null = null;

  /**
   * appearance
   */
  @Input() appearance: 'fill' | 'outline' = 'outline';

  /**
   * bindLabel
   */
  @Input() bindLabel!: string;

  /**
   * bindValue
   */
  @Input() bindValue!: string;

  /**
   * form
   */
  @Input() form: FormControl<Type | null> = new FormControl(this.default);

  /**
   * items
   */
  @Input() items: Data[] = [];

  /**
   * change
   */
  @Output() change = new EventEmitter<Type | null>();

  /**
   * subscription
   */
  private subscription? : Subscription;

  /**
   * formatterLabel
   */
  @Input() formatterLabel: (data: Data) => any = (data: Data) => {
    if (this.bindLabel && data != null && (data instanceof Object)) {
      for(const [key, value] of Object.entries(data)) {
        if (key === this.bindLabel) {
          return value;
        }
      }
    }
    return data;
  };

  /**
   * formatterOption
   */
  @Input() formatterOption: (data: Data) => any = (data: Data) => {
    if (this.bindLabel && data != null && (data instanceof Object)) {
      for(const [key, value] of Object.entries(data)) {
        if (key === this.bindLabel) {
          return value;
        }
      }
    }
    return data;
  };

  /**
   * ngOnInit
   */
  ngOnInit() {
    if (!this.form) {
      this.form = new FormControl(this.default);
    }

    if (this.id) {
      const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');

      if (filters[this.id]) {
        this.form.setValue(filters[this.id]);
      }
    }

    this.subscription = this.form.valueChanges.subscribe(value => {
      this.change.emit(value);

      if (this.id) {
        const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
        filters[this.id] = value;
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
