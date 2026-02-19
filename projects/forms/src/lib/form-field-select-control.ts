import { Component, computed, effect, inject, input, signal } from "@angular/core";

import { MatIconRegistry } from '@angular/material/icon';

import { catchError, of } from "rxjs";
import { FormFieldControl } from './form-field-control';

/**
 * FormFieldControl
 */
@Component({
  template: ''
})
export abstract class FormFieldSelectControl<I, T> extends FormFieldControl<T> {
  
  /**
   * inputs
   */
  readonly inputBindValue = input<string>('value', { alias: 'bindValue'});
  readonly inputBindTitle = input<string>('title', { alias: 'bindTitle'});
  readonly inputBindIcon = input<string>('icon', { alias: 'bindIcon'});
  readonly inputBindImage = input<string>('image', { alias: 'bindImage'});
  readonly inputItems = input<I[]>([], { alias: 'items'});
  readonly inputLimit = input<number>(30, { alias: 'limit'});

  /**
   * singnals
   */
  protected readonly itemsMaps = computed(() => {
    return this.items.map((item) => ({
      value: '',
      title: '',
      image: '',
      icon: '',
      //value: item[this.bindValue]?.toString() ?? '',
      //title: item[this.bindTitle]?.toString() ?? '',
      //image: item[this.bindImage]?.toString() ?? '',
      //icon: item[this.bindIcon]?.toString() ?? '' ,
      isMaterialIcon: signal(true),
      isSVGIcon: signal(true)
    }));
  });
  protected readonly itemsFiltered = computed(() => {
    const value = this.control.value;
    const search = this.search().toLowerCase();
    const filtered = this.itemsMaps().filter((item) => {
      const title = item.title.toLowerCase();
      const value = item.value.toLowerCase();
      return value.includes(search) || title.includes(search);
    });
    if (value && !filtered.some((item, index) => item.value === value && index < this.inputLimit())) {
      const itemSelected = this.itemsMaps().find((item) => item.value === value);
      if (itemSelected) {
        filtered.unshift(itemSelected);
      }
    }
    return filtered.slice(0, this.inputLimit());
  });
  protected readonly search = signal('');

  /**
   * injects
   */
  protected readonly icons = inject(MatIconRegistry);

  /**
   * constructor
   */
  constructor() {
    super();

    effect(() => this._bindValue.set(this.inputBindValue()));
    effect(() => this._bindTitle.set(this.inputBindTitle()));
    effect(() => this._bindIcon.set(this.inputBindIcon()));
    effect(() => this._bindImage.set(this.inputBindImage()));
    effect(() => this._items.set(this.inputItems()));
    effect(() => this._limit.set(this.inputLimit()));
    

    effect(() => {
      this.itemsMaps().forEach((item) => {
        this.icons.getNamedSvgIcon(item.icon).pipe(catchError(() =>  of(null))).subscribe((icon) => {
          item.isMaterialIcon.set(icon === null);
          item.isSVGIcon.set(icon !== null);
        });
      });
    });
  }

  /**
   * bindvalue
   */
  private _bindValue = signal('');
  get bindValue(): string {
    return this._bindValue();
  }
  set bindValue(value: string) {
    this._bindValue.set(value);
  }

  /**
   * bindTitle
   */
  private _bindTitle = signal('');
  get bindTitle(): string {
    return this._bindTitle();
  }
  set bindTitle(value: string) {
    this._bindTitle.set(value);
  }

  /**
   * bindIcon
   */
  private _bindIcon = signal('');
  get bindIcon(): string {
    return this._bindIcon();
  }
  set bindIcon(value: string) {
    this._bindIcon.set(value);
  }

  /**
   * bindImage
   */
  private _bindImage = signal('');
  get bindImage(): string {
    return this._bindImage();
  } 
  set bindImage(value: string) {
    this._bindImage.set(value);
  }

  /**
   * items
   */
  private _items = signal<I[]>([]);
  get items(): I[] {
    return this._items();
  }
  set items(value: I[]) {
    this._items.set(value);
  }

  /**
   * limit
   */
  private _limit = signal(30);
  get limit(): number {
    return this._limit();
  }
  set limit(value: number) {
    this._limit.set(value);
  }
  

  /**
   * onFilterChange
   * @param event
   */
  onFilter(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
