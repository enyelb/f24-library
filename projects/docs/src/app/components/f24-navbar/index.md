---
keyword: F24Navbar
title: F24Navbar
---

El componente `f24-navbar` es una barra de navegación superior construida sobre `MatToolbarModule`. Integra el logotipo de la aplicación (`f24-image`), un botón interactivo de alternancia (*toggle*) con icono dinámico (`f24-icon`), el título o nombre en mayúsculas y un slot de proyección dedicado (`[options]`) para acciones secundarias, perfiles de usuario o notificaciones.

### Importación

Para usar este componente y su clase de estado reactiva, impórtalos en tu componente standalone o módulo:

```typescript
import { 
  F24Navbar, 
  F24NavbarSource, 
  createNavbarSource, 
  F24NavbarSourceParams 
} from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export interface F24NavbarSourceParams {
  name?: string;
  icon?: string;
  logo?: string;
}
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[source]` | `F24NavbarSource` | `undefined` | Instancia reactiva que encapsula las señales de configuración (`name`, `icon`, `logo`). |
| `[name]` | `string` | `undefined` | Nombre o título de la aplicación mostrado en la barra superior. |
| `[icon]` | `string` | `'menu'` | Nombre del icono mostrado en el botón de toggle lateral. |
| `[logo]` | `string` | `undefined` | URL del logotipo de la aplicación renderizado con `f24-image`. |
| `(toggleNavbar)` | `OutputEmitterRef<void>` | - | Evento emitido al presionar el botón de alternancia del menú. |

---

### Variables de Plantilla HTML / Contexto

- **Slots de Proyección (`<ng-content>`):**
  - `<ng-content select="['options']"></ng-content>`: Slot reservado a la derecha de la barra para insertar botones de acción, avatares, menús desplegables o selectores de tema.
- **Formato del Título:** Aplica automáticamente el pipe `UpperCasePipe` sobre el valor de `resolvedName()`.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico con Inputs y Slot de Opciones

```html
<f24-navbar 
  [name]="'Gestión de Almacén'" 
  [icon]="'menu'"
  (toggleNavbar)="onToggleSidenav()"
>
  <div options>
    <button mat-icon-button><mat-icon>notifications</mat-icon></button>
    <button mat-icon-button><mat-icon>account_circle</mat-icon></button>
  </div>
</f24-navbar>
```

#### 2. Uso Reactivo con `F24NavbarSource` y Variables CSS

```typescript
import { Component } from '@angular/core';
import { F24Navbar, createNavbarSource } from '@f24/layout';

@Component({
  selector: 'app-navbar-wrapper',
  standalone: true,
  imports: [F24Navbar],
  template: `
    <div class="custom-navbar-container">
      <f24-navbar [source]="navbarSource" (toggleNavbar)="toggleSidebar()" />
    </div>
  `,
  styles: [`
    .custom-navbar-container {
      --f24-navbar-background: #0f172a;
      --f24-navbar-color: #f8fafc;
    }
  `]
})
export class NavbarWrapperComponent {
  readonly navbarSource = createNavbarSource({
    name: 'Módulo de Ventas',
    icon: 'menu_open',
    logo: 'assets/images/logo.png',
  });

  toggleSidebar(): void {
    // Alternar sidenav
  }
}
```

---

### Personalización con Variables CSS (`--f24-*`)

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-navbar-background` | `var(--mat-sys-primary)` | Color de fondo principal de la barra de navegación. |
| `--f24-navbar-color` | `var(--mat-sys-surface)` | Color del texto, iconos y elementos hijos dentro de la barra. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24NavbarDemo") }}

### Playground

{{ NgDocActions.playground("F24NavbarPlayground") }}
