---
keyword: F24Description
title: F24Description
---

El componente `f24-description` permite renderizar cabeceras de resumen enriquecidas (*header summaries*), compuestas por títulos enlazables, iconos de verificación, badges de estado (`f24-status`), subtítulos descriptivos y listas horizontales o multidimensionales de pares clave-valor o atributos con iconos y tooltips. Además, incluye un slot de proyección lateral (`[right]`) para acciones contextuales.

### Importación

Para usar este componente y sus interfaces de configuración, impórtalos en tu componente o módulo:

```typescript
import { 
  F24Description, 
  F24IconOpts, 
  F24StatusOpts, 
  F24ItemsOpts 
} from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export interface F24IconOpts {
  name: string;
  tooltip?: string;
  hide?: boolean;
  color?: string;
}

export interface F24StatusOpts {
  label: string;
  color?: string;
  background?: string;
  hide?: boolean;
  tooltip?: string;
  template?: TemplateRef<any>;
}

export interface F24ItemsOpts {
  icon?: string;
  label?: string;
  text: string | number;
  tooltip?: string;
  hide?: boolean;
  color?: 'none' | 'primary' | 'accent' | 'warn';
}
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[title]` | `string` | *(Requerido)* | Título principal de la descripción o entidad. |
| `[link]` | `string` | `undefined` | Ruta de Angular Router (`[routerLink]`) para convertir el título en un enlace navegable. |
| `[subtitle]` | `string` | `undefined` | Texto de apoyo o descripción secundaria bajo el título. |
| `[icon]` | `F24IconOpts` | `undefined` | Objeto de configuración para el icono contiguo al título principal. |
| `[status]` | `F24StatusOpts[]` | `[]` | Colección de badges de estado que se renderizan con `f24-status`. |
| `[items]` | `F24ItemsOpts[] \| F24ItemsOpts[][]` | `[]` | Lista de atributos/metadatos clave-valor. Soporta 1D para una sola fila o 2D (matriz) para múltiples filas. |

---

### Variables de Plantilla HTML / Contexto

- **Slots de Proyección (`<ng-content>`):**
  - `<ng-content [right]></ng-content>`: Slot ubicado en el extremo derecho del contenedor para incrustar botones de acción (ej. botones de descarga, edición, menús contextuales).
- **Normalización Automática:** Transforma internamente arreglos de ítems unidimensionales en bidimensionales para organizar filas de metadatos de forma flexible.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico

```html
<f24-description
  [title]="'Factura #FAC-2026-0042'"
  [subtitle]="'Emitida el 05 de Septiembre, 2026'"
  [icon]="{ name: 'verified', tooltip: 'Documento Verificado' }"
  [status]="[{ label: 'Pagada', color: '#166534', background: '#dcfce7' }]"
  [items]="[
    { label: 'Cliente:', text: 'Acme Corp' },
    { icon: 'attach_money', label: 'Total:', text: '1,450.00 USD', color: 'primary' }
  ]"
>
  <button mat-flat-button right>Descargar PDF</button>
</f24-description>
```

#### 2. Personalización Visual con Variables CSS

```html
<div class="custom-description-card">
  <f24-description
    [title]="'Orden de Despacho #ORD-991'"
    [link]="'/orders/991'"
    [status]="[{ label: 'En Tránsito', color: '#1e40af', background: '#dbeafe' }]"
    [items]="[
      [
        { label: 'Destino:', text: 'Caracas, VE' },
        { label: 'Transporte:', text: 'Envío Aéreo' }
      ],
      [
        { icon: 'schedule', text: 'Entrega estimada: 24h', color: 'primary' }
      ]
    ]"
  />
</div>

<style>
.custom-description-card {
  --primary-color: var(--f24-primary-color, #2563eb);
  --success: var(--f24-success-color, #16a34a);
  --mat-sys-primary: var(--f24-primary-color, #2563eb);
}
</style>
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--primary-color` / `--seped-main-color` | `blue` | Color principal del texto del título. |
| `--success` / `--seped-green-color` | `green` | Color aplicado al icono principal contiguo al título. |
| `--mat-sys-primary` | `blue` | Color de fondo de los ítems con variante `color: 'primary'`. |
| `--f24-primary-color` | *(Variable de aplicación)* | Permite centralizar el color de marca en títulos y badges. |
| `--f24-success-color` | *(Variable de aplicación)* | Color de éxito para estados e iconos. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24DescriptionDemo") }}

### Playground

{{ NgDocActions.playground("F24DescriptionPlayground") }}
