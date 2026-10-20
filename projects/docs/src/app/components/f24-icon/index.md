---
keyword: F24Icon
title: F24Icon
---

El componente `f24-icon` unifica el renderizado de iconos en la aplicación. Permite utilizar iconos estándar de fuentes Material Icons (`mat-icon`), gráficos vectoriales SVG registrados y animaciones GIF personalizadas mediante `F24IconService`, gestionando automáticamente el tamaño y la sanitización de URLs.

### Importación

Para usar este componente y el servicio de registro de iconos, impórtalos en tu componente standalone o módulo:

```typescript
import { F24Icon, F24IconService, F24IconType } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export type F24IconType = {
  type: 'svg' | 'gif';
  path: string;
  url: SafeResourceUrl;
};
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[icon]` | `string` | *(Requerido)* | Nombre del icono a renderizar (nombre de fuente Material o identificador registrado en `F24IconService`). |
| `[size]` | `number` | `24` | Dimensión cuadrada en píxeles (`width`, `height`, `font-size`) aplicada al icono o imagen. |

---

### Variables de Plantilla HTML / Contexto

- **Detección Automática de Tipo:**
  - Si el identificador está registrado en `F24IconService` como SVG: renderiza `<mat-icon [svgIcon]="icon()"></mat-icon>`.
  - Si está registrado como GIF: renderiza `<img>` con bordes redondeados calculados en base al tamaño.
  - Por defecto: renderiza `<mat-icon>\{\{ icon() \}\}</mat-icon>`.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico con Material Icons

```html
<f24-icon icon="home" [size]="24" />
<f24-icon icon="person" [size]="32" />
```

#### 2. Registro de Iconos SVG o GIF Personalizados

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { F24Icon, F24IconService } from '@f24/layout';

@Component({
  selector: 'app-custom-icons-example',
  standalone: true,
  imports: [F24Icon],
  template: `
    <div class="icon-group">
      <f24-icon [icon]="'custom-logo'" [size]="40" />
      <f24-icon [icon]="'spinner-anim'" [size]="32" />
    </div>
  `,
})
export class CustomIconsExampleComponent implements OnInit {
  private iconService = inject(F24IconService);

  ngOnInit(): void {
    // Registra SVGs o GIFs desde assets
    this.iconService.register('custom-logo', 'assets/icons/custom-logo.svg');
    this.iconService.register('spinner-anim', 'assets/gif/loading.gif');
  }
}
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--mat-icon-button-icon-size` | *Igual a `[size]`* | Dimensión CSS asignada internamente para que encaje dentro de botones Material. |
| `--f24-icon-color` | `currentColor` | Color heredado o personalizado para el icono. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24IconDemo") }}

### Playground

{{ NgDocActions.playground("F24IconPlayground") }}
