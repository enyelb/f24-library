# Migración de componentes `forms-v2` a Signal Forms

Este documento describe las instrucciones para adaptar un componente del módulo `forms-v2`
(de `@angular/forms` reactivo a `@angular/forms/signals`) tomando como referencia
`form-input` (caso soportado) y `form-select` (caso con binding interno por ngModel).

El patrón general tiene dos partes independientes:

1. **El Source** (`xxx-source.ts`): solo señales puras de Angular, sin `FormControl`.
2. **El Componente** (`xxx.ts` / `xxx.html`): recibe un `Field` de signal form y, según el
   control, se enlaza directo (`[formField]`) o con un ngModel interno.

---

## 1. Source (`form-xxx-source.ts`)

Reglas a seguir (comparar con `form-input-source.ts`):

- **No usar `signalSource`** (el helper de `@f24/core`). Usar `signal()` nativo de Angular.
- **No usar `FormControl`** ni ningún import de `@angular/forms` reactivo.
- El campo del formulario se tipa con `Field` de `@angular/forms/signals`:

  ```ts
  import { signal, untracked } from '@angular/core';
  import { Field } from '@angular/forms/signals';

  export interface F24FormXxxSourceParams {
    // ...
    form?: Field<any>; // <- signal form, no FormControl
  }
  ```

- Cada propiedad del source es una señal privada expuesta de solo lectura:

  ```ts
  export class F24FormXxxSource {
    protected readonly _label = signal<string>('');
    readonly label = this._label.asReadonly();
    // ...
  }
  ```

- El constructor **no debe llevar `effect` ni subscripciones a `valueChanges`**.
  Cualquier reacción al valor debe vivir en el signal form o en el componente, no en el source.
- El método `update` actualiza con `??` dentro de `untracked` (no usar `setExectUndefined`):

  ```ts
  public update(params?: F24FormXxxSourceParams, params2?: F24FormXxxSourceParams) {
    untracked(() => {
      this._label.set(params?.label ?? params2?.label ?? this._label());
      // ...
    });
  }
  ```

- Conservar únicamente el factory `create...`:

  ```ts
  export const createFormXxxSource = (params?: F24FormXxxSourceParams) =>
    new F24FormXxxSource(params);
  ```

---

## 2. Componente (`form-xxx.ts`)

- **Quitar todo lo de reactive forms**: `NgControl`, `ReactiveFormsModule`, `FormControl`,
  el provider `F24_FORM_TOKEN`, `ControlValueAccessor`, `ngOnInit/ngOnDestroy`, el input `params`
  y el `effect` que copiaba los inputs al source.
- Importar `FormField` de `@angular/forms/signals` y los módulos de Material/mtx necesarios.
- El input `source` va **sin valor por defecto** (como `form-input`):

  ```ts
  readonly source = input<F24FormXxxSource>();
  ```

- Cada input del componente se tipa reutilizando el params del source:

  ```ts
  readonly label = input<F24FormXxxSourceParams['label']>();
  ```

- Crear un `computed` `resolved...` por propiedad que combine `source` y `input`:

  ```ts
  readonly resolvedLabel = computed(() => this.source()?.label() ?? this.label() ?? '');
  readonly resolvedForm  = computed(() => this.source()?.form() ?? this.form() ?? null);
  ```

- El componente **no inicializa el source**: se le pasa ya creado o se usan solo los inputs.

---

## 3. Enlace en el template

### 3.a Control soportado por signal forms (caso `form-input`)

Usar la directiva `formField` y leer el estado con `resolvedForm()` (función):

```html
@if (resolvedForm(); as form) {
  <mat-form-field [appearance]="resolvedAppearance()">
    <mat-label>{{ resolvedLabel() }}</mat-label>
    <input matInput [type]="resolvedType()" [formField]="form" />

    <mat-error>
      <f24-form-errors [field]="form()" />
    </mat-error>
    @if (form().valid()) {
      <mat-icon matSuffix color="primary">check</mat-icon>
    }
  </mat-form-field>
}
```

> `form` es el `Field`; `form()` devuelve el `FieldState` (`.valid()`, `.errors`, `.value`, etc.).

### 3.b Control NO soportado por signal forms (caso `mtx-select`)

Cuando la librería (mtx, ng-select, etc.) no acepta `formField`, se hace un **binding interno con
ngModel** y se sincroniza a mano contra el `Field`.

1. Importar `FormsModule` (no `ReactiveFormsModule`) en el `imports` del `@Component`.
2. Exponer un `model` de solo lectura y handlers en el componente:

   ```ts
   readonly fieldState = computed(() => this.resolvedForm()?.());
   readonly model = computed(() => this.fieldState()?.value() ?? this.resolvedDefault());

   onChange(value: Type | null) {
     const state = this.fieldState();
     if (state) {
       state.value.set(value);   // escribe en el signal form
       state.markAsDirty();
     }
     this.resolvedChange()?.(value);
   }

   onBlur() {
     this.fieldState()?.markAsTouched();
   }
   ```

3. Enlazar en el template con `[ngModel]` + `(ngModelChange)` + `(blur)`:

   ```html
   <mtx-select
     [items]="resolvedItems()"
     [bindLabel]="resolvedBindLabel()"
     [bindValue]="resolvedBindValue()"
     [multiple]="resolvedMultiple()"
     [ngModel]="model()"
     (ngModelChange)="onChange($event)"
     (blur)="onBlur()"
   >
     <!-- templates de label/opcion -->
   </mtx-select>

   <mat-error>
     <f24-form-errors [field]="form()" />
   </mat-error>
   ```

---

## 4. Errores

`F24FormErrors` ahora recibe el **`FieldState`** en la entrada `field` (no `errors`):

```html
<f24-form-errors [field]="form()" />
```

---

## 5. Checklist de migración

- [ ] Source: señales nativas, `form?: Field<...>`, sin `signalSource`, sin `FormControl`, sin `effect`/`valueChanges`.
- [ ] Componente: sin `NgControl`, `ReactiveFormsModule`, `F24_FORM_TOKEN`, `ControlValueAccessor`, `params`, `effect`.
- [ ] `source = input<XxxSource>()` sin valor por defecto.
- [ ] Computeds `resolved...` para `source` + `input`.
- [ ] Template con `@if (resolvedForm(); as form)` y `[field]="form()"` en los errores.
- [ ] Si el control NO soporta signal forms: `[ngModel]="model()"` + `(ngModelChange)` que hace
      `fieldState.value.set(...)` + `markAsDirty()` + `markAsTouched()` en `(blur)`.
- [ ] Ejecutar `npx ngc -p projects/forms-v2/tsconfig.lib.json --noEmit` y confirmar que
      `form-xxx` no reporta errores.
