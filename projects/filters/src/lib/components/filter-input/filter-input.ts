import { Component, input, Input, OnDestroy, OnInit } from '@angular/core';
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
  readonly id = input('');

  /**
   * label
   */
  readonly label = input('Filter');

  /**
   * placeholder
   */
  readonly placeholder = input('') ;

  /**
   * dafault
   */
  readonly default = input<any>(null);

  /**
   * form
   */
  readonly form = input(new FormControl(this.default()));

  /**
   * appearance
   */
  readonly appearance = input<'fill' | 'outline'>('outline');

  /**
   * subscription
   */
  private subscription? : Subscription;

  /**
   * ngOnInit
   */
  ngOnInit() {
    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');

    if (this.id()) {
      if (filters[this.id()]) {
        this.form().setValue(filters[this.id()]);
      }

      this.subscription = this.form().valueChanges.subscribe(value => {
        const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
        filters[this.id()] = value;
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
