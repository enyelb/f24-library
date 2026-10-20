---
keyword: F24Lazy
title: F24Lazy
---

El componente `f24-lazy` proporciona un host de carga perezosa (*lazy loading*) programática para instanciar componentes bajo demanda sin bloquear el bundle inicial. Gestiona automáticamente contenedores de vistas dinámicas (`ViewContainerRef`), spinners de carga integrados (`F24Loader`), inyección de inputs reactivos y callbacks post-renderizado mediante una interfaz fluida con encadenamiento de métodos (*builder pattern*).

### Importación

Para usar este componente y sus tipos asociados, impórtalos en tu componente standalone o módulo:

```typescript
import { 
  F24Lazy, 
  F24LazyId, 
  F24LazyModule, 
  F24LazyPost, 
  F24LazyInputs, 
  F24LazyComponent 
} from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export type F24LazyId<C> = string | Type<C>;

export interface F24LazyModule<C> {
  (): Promise<Type<C>>;
}

export interface F24LazyPost<C> {
  (component: C): void;
}

export interface F24LazyInputs {
  (): { [key: string]: any };
}

export interface F24LazyComponent<C> {
  (component: C): void;
}
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[disableLoading]` | `boolean` | `false` | Desactiva la visualización del spinner `<f24-loader>` durante el proceso de resolución y carga. |

---

### Métodos Públicos de la Instancia

`F24Lazy` implementa una API encadenable para configurar y orquestar la carga del componente:

| Método | Argumentos | Retorno | Descripción |
| :--- | :--- | :--- | :--- |
| `loadId(id)` | `F24LazyId<C>` | `F24Lazy<C>` | Identificador único del componente. Si el `id` cambia, destruye la instancia previa. |
| `loadInputs(inputs)` | `F24LazyInputs` | `F24Lazy<C>` | Función que devuelve el diccionario de `@Input()` a asignar a la instancia. |
| `loadPost(post)` | `F24LazyPost<C>` | `F24Lazy<C>` | Callback que se ejecuta inmediatamente después de instanciar el componente. |
| `load(module)` | `F24LazyModule<C>` | `F24Lazy<C>` | Promesa/import dinámico que resuelve el tipo de componente Angular. |
| `component(fn?)` | `F24LazyComponent<C>?` | `C \| undefined` | Obtiene la instancia activa o ejecuta una función sobre ella. |
| `isLoad()` | - | `boolean` | Retorna `true` si la instancia del componente ya está creada. |
| `isLodaing()` | - | `boolean` | Retorna `true` mientras el módulo se encuentra en proceso de importación. |

---

### Variables de Plantilla HTML / Contexto

- **Contenedor Dinámico:** Utiliza un host interno `#componentViewContainerRef` (`ng-container`) donde inyecta el `ComponentRef`.
- **Transición de Entrada:** Aplica automáticamente la animación CSS `@keyframes fadeInLazy` con duración de 0.8s.

---

### Demos y Ejemplos de Uso

#### 1. Carga Dinámica Bajo Demanda con Imports Asíncronos

```typescript
import { Component, viewChild, AfterViewInit } from '@angular/core';
import { F24Lazy } from '@f24/layout';

@Component({
  selector: 'app-dynamic-feature',
  standalone: true,
  imports: [F24Lazy],
  template: `
    <div class="dynamic-container">
      <f24-lazy #lazyHost />
    </div>
  `,
})
export class DynamicFeatureComponent implements AfterViewInit {
  readonly lazyHost = viewChild<F24Lazy<any>>('lazyHost');

  ngAfterViewInit(): void {
    this.lazyHost()
      ?.loadId('UserProfileWidget')
      ?.loadInputs(() => ({ userId: 'USR-8821' }))
      ?.load(() => import('./user-profile-widget').then(m => m.UserProfileWidget));
  }
}
```

---

### Personalización con Variables CSS

```css
.dynamic-container {
  --f24-lazy-height: 100%;
  --f24-lazy-animation-duration: 0.8s;
}
```

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `animation` | `fadeInLazy 0.8s ease forwards` | Animación de opacidad al completar la carga. |
| `--f24-lazy-height` | `100%` | Altura del contenedor del elemento lazy. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24LazyDemo") }}

### Playground

{{ NgDocActions.playground("F24LazyPlayground") }}
