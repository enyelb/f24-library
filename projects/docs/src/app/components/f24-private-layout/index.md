---
keyword: F24PrivateLayout
title: F24PrivateLayout
---

El componente `f24-private-layout` provee una estructura de layout base para áreas privadas o autenticadas de la aplicación. Integra de manera reactiva la barra de navegación superior (`f24-navbar`), el menú lateral (`f24-sidenav`) con soporte para rutas anidadas y modo compacto, y el contenedor central `<router-outlet>` para vistas enrutadas con comportamiento responsive automático (`side` en escritorio y `over` en móviles).

### Importación

Para utilizar este componente y sus utilidades asociadas, impórtalo en tu componente standalone o módulo:

```typescript
import { 
  F24PrivateLayout, 
  F24PrivateLayoutSource, 
  createPrivateLayoutSource, 
  F24PrivateLayoutSourceParams,
  F24SidenavRouteSourceParams 
} from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export interface F24SidenavRouteSourceParams {
  title: string;
  url?: string;
  icon?: string;
  children?: F24SidenavRouteSourceParams[];
}

export type F24PrivateLayoutSourceParams = {
  name?: string;
  routes?: F24SidenavRouteSourceParams[];
  isMobile?: boolean;
  allowExpandedMultiple?: boolean;
  compact?: boolean;
  icon?: string;
  logo?: string;
  top?: boolean;
  position?: 'start' | 'end';
};
```

---

### Propiedades y Parámetros (Inputs)

El componente puede configurarse pasando individualmente cada señal de entrada (`input()`) o vinculando una instancia reactiva de `F24PrivateLayoutSource` a través de la propiedad `[source]`.

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[source]` | `F24PrivateLayoutSource` | `undefined` | Instancia reactiva contenedora de toda la configuración del layout. |
| `[name]` | `string` | `''` | Nombre o título de la aplicación mostrado en la barra de navegación o cabecera. |
| `[routes]` | `F24SidenavRouteSourceParams[]` | `[]` | Colección de rutas y enlaces de navegación para el menú lateral. Soporta jerarquía anidada (`children`). |
| `[icon]` | `string` | `'menu'` | Nombre del icono utilizado en el botón de alternancia (*toggle*) del menú. |
| `[compact]` | `boolean` | `false` | Activa el modo compacto para el sidenav (muestra iconos colapsados que se expanden en *hover*). |
| `[top]` | `boolean` | `false` | Determina si la barra de navegación se ubica por encima del contenedor del sidenav (`true`) o dentro del área de contenido principal (`false`). |
| `[position]` | `'start' \| 'end'` | `'start'` | Posición del sidenav dentro del viewport (`'start'` a la izquierda, `'end'` a la derecha). |

---

### Variables y Plantilla HTML

- **Enrutamiento:** Contiene un `<router-outlet></router-outlet>` dentro de `<main class="main-content">`, donde se renderizan automáticamente las vistas activas de Angular Router.
- **Detección Responsive:** Utiliza internamente `F24LayoutService` para conmutar automáticamente el modo del `mat-sidenav` entre `'side'` (pantallas medianas/grandes) y `'over'` (dispositivos móviles `xs`/`s`).

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico mediante Inputs

Configuración declarativa directa pasando propiedades individuales:

```html
<f24-private-layout
  [name]="'Panel de Control'"
  [routes]="appRoutes"
  [compact]="false"
  [position]="'start'"
  [top]="false"
/>
```

```typescript
import { Component } from '@angular/core';
import { F24PrivateLayout, F24SidenavRouteSourceParams } from '@f24/layout';

@Component({
  selector: 'app-private-wrapper',
  standalone: true,
  imports: [F24PrivateLayout],
  templateUrl: './private-wrapper.html',
})
export class PrivateWrapperComponent {
  readonly appRoutes: F24SidenavRouteSourceParams[] = [
    { title: 'Inicio', icon: 'home', url: '/home' },
    {
      title: 'Configuración',
      icon: 'settings',
      children: [
        { title: 'Perfil', icon: 'person', url: '/settings/profile' },
        { title: 'Seguridad', icon: 'lock', url: '/settings/security' }
      ]
    }
  ];
}
```

#### 2. Uso Avanzado con `F24PrivateLayoutSource`

Permite actualizar dinámicamente el estado y la configuración del layout de manera desacoplada:

```typescript
import { Component } from '@angular/core';
import { F24PrivateLayout, createPrivateLayoutSource } from '@f24/layout';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [F24PrivateLayout],
  template: `
    <f24-private-layout [source]="layoutSource" />
  `,
})
export class AdminLayoutComponent {
  readonly layoutSource = createPrivateLayoutSource({
    name: 'Sistema ERP',
    compact: true,
    top: true,
    position: 'start',
    routes: [
      { title: 'Ventas', icon: 'point_of_sale', url: '/sales' },
      { title: 'Inventario', icon: 'inventory_2', url: '/inventory' }
    ]
  });

  // Actualización dinámica de configuración
  toggleCompactMode(isCompact: boolean) {
    this.layoutSource.update({ compact: isCompact });
  }
}
```

---

### Personalización con Variables CSS (`--f24-*`)

El layout expone variables CSS personalizadas que permiten modificar el aspecto del cascarón, dimensiones del sidenav y colores de superficie:

```css
.custom-layout-theme {
  --f24-private-layout-background: #f1f5f9;
  --f24-private-layout-sidenav-width: 280px;
  --f24-private-layout-sidenav-collapsed-width: 68px;
  --f24-sidebar-padding: 12px;
  --f24-sidebar-item-padding: 10px;
}
```

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-private-layout-background` | `var(--mat-sys-surface)` | Color de fondo principal del contenedor del layout. |
| `--f24-private-layout-sidenav-width` | `250px` | Ancho total del sidenav en modo expandido. |
| `--f24-private-layout-sidenav-collapsed-width` | *Cálculo automático (~68px)* | Ancho colapsado del sidenav cuando `compact` es `true`. |
| `--f24-sidebar-padding` | *Cálculo basado en material* | Espaciado interno general del contenedor del sidenav. |
| `--f24-sidebar-item-padding` | *Cálculo basado en material* | Espaciado interno de cada elemento individual de la lista del menú. |
| `--global-margin` | `undefined` | Margen global aplicado a la zona de contenido principal (`.main-content`). |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24PrivateLayoutDemo") }}

### Playground

{{ NgDocActions.playground("F24PrivateLayoutPlayground") }}
