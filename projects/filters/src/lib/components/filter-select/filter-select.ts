import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';

import { 
  createFilterSelectSource, createFilterSelectSourceParams, 
  F24FilterSelectSourceParams, F24FilterSelectBindSourceParams, F24FilterSelectFormatterSourceParams
} from './filter-select-source';

/**
 * F24FilterSelectComponent
 */
@Component({
  selector: 'f24-filter-select',
  styleUrls: ['filter-select.scss'],
  templateUrl: 'filter-select.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, MtxSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24FilterSelect<Type, Item> {
  /**
   * elementRef
   */
  protected readonly elementRef = inject(ElementRef);
  /**
   * source 
   */
  readonly params = input(createFilterSelectSourceParams<Type, Item>());
  readonly source = input(createFilterSelectSource<Type, Item>());
  /**
   * inputs
   */
  readonly id = input<F24FilterSelectSourceParams<Type, Item>['id']>();
  readonly dataSource = input<F24FilterSelectSourceParams<Type, Item>['dataSource']>();
  readonly label = input<F24FilterSelectSourceParams<Type, Item>['label']>();
  readonly appearance = input<F24FilterSelectSourceParams<Type, Item>['appearance']>();
  readonly name = input<F24FilterSelectSourceParams<Type, Item>['name']>();
  readonly icon = input<F24FilterSelectSourceParams<Type, Item>['icon']>();
  readonly default = input<F24FilterSelectSourceParams<Type, Item>['default']>();
  readonly placeholder = input<F24FilterSelectSourceParams<Type, Item>['placeholder']>();
  readonly form = input<F24FilterSelectSourceParams<Type, Item>['form']>();
  readonly type = input<F24FilterSelectSourceParams<Type, Item>['type']>();
  readonly change = input<F24FilterSelectSourceParams<Type, Item>['change']>();
  readonly multiple = input<F24FilterSelectSourceParams<Type, Item>['multiple']>();
  readonly items = input<F24FilterSelectSourceParams<Type, Item>['items']>();
  readonly formatterLabel = input<F24FilterSelectFormatterSourceParams<Item>>();
  readonly formatterValue = input<F24FilterSelectFormatterSourceParams<Item>>();
  readonly bindLabel = input<F24FilterSelectBindSourceParams>();
  readonly bindValue = input<F24FilterSelectBindSourceParams>();
  /**
   * appendTo
   */
  readonly unique = Date.now();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        id: this.id(),
        dataSource: this.dataSource(),
        label: this.label(),
        appearance: this.appearance(),
        name: this.name(),
        icon: this.icon(),
        default: this.default(),
        placeholder: this.placeholder(),
        form: this.form(),
        type: this.type(),
        change: this.change(),
        multiple: this.multiple(),
        items: this.items(),
        formatter: {
          label: this.formatterLabel(),
          value: this.formatterValue()
        },
        bind: {
          label: this.bindLabel(),
          value: this.bindValue()
        }
      }, this.params());
    });
    /**
     * efecto para observar el elemento y en el momento que se haga visible asignar el class container
     * para en caso de que el photoviewer este dento de un dialog se muestre correctamente 
     * Nota: esto solo se ejecutara una vez porque dentro del mismo observer se deconecta
     */
    effect(() => {
      const element = this.elementRef?.nativeElement;
      if (!element) {
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Si al menos una parte del componente es visible
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            setTimeout(() => {
              if (this.elementRef.nativeElement.closest('.cdk-overlay-popover')) {
                this.source().update({ appendTo: '.cdk-overlay-popover' });
              }
            }, 60);
            observer.disconnect();
          }
        });
      });
      observer.observe(element);
    }); 
  }
}
