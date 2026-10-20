---
keyword: F24Sidenav
title: F24Sidenav
---

El componente `f24-sidenav` proporciona el árbol de navegación lateral principal de la aplicación. Renderiza dinámicamente rutas multinivel con iconos de Material Icons, gestión de estado expandido/colapsado para submenús (`children`), modo compacto de solo iconos para vistas reducidas y control de expansión exclusiva o múltiple mediante `F24SidenavItem`.

### Importación

Para usar este componente y sus utilidades, impórtalos en tu componente standalone o módulo:

```typescript
import { 
  F24Sidenav, 
  F24SidenavSource, 
  createSidenavSource, 
  F24SidenavSourceParams, 
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

export interface F24SidenavSourceParams {
  name?: string;
  routes?: F24SidenavRouteSourceParams[];
  isMobile?: boolean;
  allowExpandedMultiple?: boolean;
  compact?: boolean;
}
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[source]` | `F24SidenavSource` | `undefined` | Instancia reactiva de estado que encapsula las rutas y propiedades de configuración. |
| `[name]` | `string` | `undefined` | Título o nombre de la sección de navegación colocado en la cabecera del sidenav. |
| `[routes]` | `F24SidenavRouteSourceParams[]` | `[]` | Colección de rutas de navegación con soporte para anidamiento (`children`). |
| `[isMobile]` | `boolean` | `undefined` | Indicador de dispositivo móvil para adaptar interacciones y colapso. |
| `[allowExpandedMultiple]` | `boolean` | `false` | Permite mantener múltiples submenús expandidos simultáneamente (`true`) o colapsa automáticamente los otros al abrir uno (`false`). |
| `[compact]` | `boolean` | `true` | Habilita el modo compacto mostrando únicamente los iconos. |

---

### Variables de Plantilla HTML / Contexto

- **Estructura Interna:** Itera sobre `resolvedRoutes()` instanciando elementos `<f24-sidenav-item>` que manejan transiciones de altura CSS suaves para submenús hijos.
- **Gestión de Acordeón:** Si `allowExpandedMultiple` es `false`, el método `changeExpanded()` contrae cualquier otro ítem abierto al activar una nueva sección.

---

### Demos y Ejemplos de Uso

#### 1. Uso Estándar con Rutas Jerárquicas

```html
<f24-sidenav 
  [name]="'Panel de Control'"
  [routes]="menuRoutes" 
  [compact]="false" 
  [allowExpandedMultiple]="false" 
/>
```

```typescript
import { Component } from '@angular/core';
import { F24Sidenav, F24SidenavRouteSourceParams } from '@f24/layout';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [F24Sidenav],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  readonly menuRoutes: F24SidenavRouteSourceParams[] = [
    { title: 'Dashboard', icon: 'dashboard', url: '/dashboard' },
    {
      title: 'Catálogo',
      icon: 'store',
      children: [
        { title: 'Categorías', icon: 'folder', url: '/catalog/categories' },
        { title: 'Productos', icon: 'inventory', url: '/catalog/products' }
      ]
    },
    { title: 'Ajustes', icon: 'tune', url: '/settings' }
  ];
}
```

---

### Personalización con Variables CSS (`--f24-*`)

El componente ofrece variables CSS dedicadas para personalizar colores de fondo, texto, bordes redondeados y submenús:

```css
.custom-sidenav-theme {
  --f24-sidenav-background: #0f172a;
  --f24-sidenav-color: #f8fafc;
  --f24-sidenav-children-background: #1e293b;
  --f24-sidenav-children-color: #e2e8f0;
  --f24-sidenav-item-border-radius: 12px;
}
```

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-sidenav-background` | `var(--mat-sys-primary)` | Color de fondo principal del sidenav. |
| `--f24-sidenav-color` | `var(--mat-sys-surface)` | Color del texto e iconos de los ítems de navegación. |
| `--f24-sidenav-padding` | *Cálculo automático* | Espaciado interior general del contenedor de la lista de navegación. |
| `--f24-sidenav-item-border-radius` | `15px` | Radio de los bordes redondeados de cada ítem de menú. |
| `--f24-sidenav-item-padding` | *Cálculo automático* | Espaciado interior de cada ítem individual. |
| `--f24-sidenav-children-background` | `var(--mat-sys-on-primary-container)` | Color de fondo del bloque de rutas hijas cuando está expandido. |
| `--f24-sidenav-children-color` | `var(--mat-sys-surface)` | Color del texto de las opciones dentro de un submenú hijo. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24SidenavDemo") }}

### Playground

{{ NgDocActions.playground("F24SidenavPlayground") }}
