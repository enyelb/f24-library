---
keyword: F24ResponsiveView
title: F24ResponsiveView
---

El componente `f24-responsive-view` orquesta la alternancia adaptativa y perezosa (*lazy loaded*) de múltiples vistas o componentes según el ancho de pantalla o contenedor. Emplea `ResizeObserver` para detectar dinámicamente los breakpoints (`xs`, `s`, `m`, `l`, `xl`, `xxl`), instanciando exclusivamente la vista correspondiente mediante `F24Lazy`, e incluye un menú desplegable en esquina superior para permitir la conmutación manual interactiva.

### Importación

Para usar este componente y sus interfaces de tipado, impórtalos en tu componente standalone o módulo:

```typescript
import { 
  F24ResponsiveView, 
  F24ResponsiveViewComponent, 
  F24ResponsiveViewSize 
} from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export type F24ResponsiveViewSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export interface F24ResponsiveViewComponent<C> {
  sizes: F24ResponsiveViewSize[];
  id: F24LazyId<C>;
  module: F24LazyModule<C>;
  icon?: string;
  label?: string;
  only?: boolean;
  post?: F24LazyPost<C>;
  inputs?: F24LazyInputs;
}
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[components]` | `F24ResponsiveViewComponent<any>[]` | *(Requerido)* | Arreglo de configuraciones de vistas asociadas a rangos de tamaño de pantalla (`sizes`), módulos de carga asíncrona e iconos/etiquetas descriptivas. |

---

### Variables de Plantilla HTML / Contexto

- **Host Perezoso Múltiple:** Itera internamente los componentes generando elementos `<f24-lazy>` que se muestran u ocultan mediante `display: block / none` para preservar estados si ya fueron inicializados.
- **Selector Flotante en Esquina:** Si los componentes definen `icon` y no tienen la propiedad `only: true`, renderiza una solapa interactiva en la esquina superior derecha (`.f24-responsive-view-options`) para forzar manualmente un breakpoint o vista.

---

### Demos y Ejemplos de Uso

#### 1. Configuración de Vistas Adaptativas (Desktop vs Móvil)

```typescript
import { Component } from '@angular/core';
import { F24ResponsiveView, F24ResponsiveViewComponent } from '@f24/layout';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [F24ResponsiveView],
  template: `
    <div class="view-viewport">
      <f24-responsive-view [components]="adaptiveViews" />
    </div>
  `,
})
export class UsersPageComponent {
  readonly adaptiveViews: F24ResponsiveViewComponent<any>[] = [
    {
      id: 'UsersTableDesktop',
      sizes: ['m', 'l', 'xl', 'xxl'],
      module: () => import('./users-table-desktop').then(m => m.UsersTableDesktop),
      icon: 'table_view',
      label: 'Tabla',
    },
    {
      id: 'UsersCardsMobile',
      sizes: ['xs', 's'],
      module: () => import('./users-cards-mobile').then(m => m.UsersCardsMobile),
      icon: 'view_agenda',
      label: 'Tarjetas',
    },
  ];
}
```

---

### Personalización con Variables CSS

```css
.view-viewport {
  --seped-main-color: var(--f24-primary-color, #2563eb);
  --mat-sys-surface: #ffffff;
  --global-margin: 16px;
}
```

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--seped-main-color` | `undefined` | Color de fondo del botón triangular de opciones en la esquina. |
| `--mat-sys-surface` | `undefined` | Color de superficie al expandir las opciones del menú flotante. |
| `--global-margin` | `undefined` | Espaciado interno de los botones de cambio de vista. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24ResponsiveViewDemo") }}

### Playground

{{ NgDocActions.playground("F24ResponsiveViewPlayground") }}
