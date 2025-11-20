import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Subscription } from 'rxjs';

/**
 * F24FilterInputComponent
 */
@Component({
  selector: 'f24-filter-input',
  styleUrls: ['filter-input.scss'],
  templateUrl: 'filter-input.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
})
export class F24FilterInput implements OnInit, OnDestroy {

  /**
   * id
   */
  @Input() id : string = '';

  /**
   * label
   */
  @Input() label: string = 'Filter';

  /**
   * placeholder
   */
  @Input() placeholder!: string;

  /**
   * dafault
   */
  @Input() default: any = null;

  /**
   * appearance
   */
  @Input() appearance: 'fill' | 'outline' = 'outline';

  /**
   * form
   */
  @Input() form!: FormControl;

  /**
   * subscription
   */
  private subscription? : Subscription;

  /**
   * ngOnInit
   */
  ngOnInit() {
    if (!this.form) {
      this.form = new FormControl(this.default);
    }

    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');

    if (this.id) {
      if (filters[this.id]) {
        this.form.setValue(filters[this.id]);
      }

      this.subscription = this.form.valueChanges.subscribe(value => {
        const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
        filters[this.id] = value;
        localStorage.setItem("filters", JSON.stringify(filters));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
