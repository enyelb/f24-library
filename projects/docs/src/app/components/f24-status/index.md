---
keyword: F24Status
title: F24Status
---

El componente `f24-status` proporciona una píldora visual tipo badge o chip redondeado para comunicar estados de procesos, entidades o registros (como 'Activo', 'Pendiente', 'Error' o estados booleanos). Admite personalización directa de colores de texto y fondo, tooltips informativos y contenido enriquecido flotante mediante popovers interactivos (`mtx-popover`) que se despliegan automáticamente al situar el cursor (*hover*).

### Importación

Para usar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Status } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

El componente acepta valores directos `string | number | boolean` y opcionalmente un `TemplateRef<any>` para plantillas contextuales avanzadas.

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[status]` | `string \| number \| boolean` | *(Requerido)* | Valor o texto representativo del estado que se mostrará dentro de la píldora. |
| `[color]` | `string` | `'black'` | Color CSS del texto del badge. |
| `[background]` | `string` | `'white'` | Color CSS de fondo de la píldora. |
| `[tooltip]` | `string \| null \| undefined` | `undefined` | Texto emergente nativo mediante `matTooltip`. |
| `[template]` | `TemplateRef<any>` | `undefined` | Referencia de plantilla Angular (`<ng-template>`) mostrada dentro de un `mtx-popover` al hacer hover. |

---

### Variables de Plantilla HTML / Contexto

- **Integración con Popovers (`mtx-popover`):** Cuando se suministra la entrada `[template]`, el componente activa un disparador `mtxPopoverTriggerOn="hover"` con retardos de entrada y salida configurados a 500ms y posicionamiento inteligente arriba o abajo (`['above', 'below']`).

---

### Demos y Ejemplos de Uso

#### 1. Badges de Estado Estándar

```html
<f24-status 
  [status]="'Activo'" 
  [color]="'#15803d'" 
  [background]="'#dcfce7'" 
  [tooltip]="'Registro activo en base de datos'"
/>

<f24-status 
  [status]="'Pendiente'" 
  [color]="'#b45309'" 
  [background]="'#fef3c7'"
/>
```

#### 2. Estado con Popover Contextual

```html
<f24-status 
  [status]="'Con Advertencia'" 
  [color]="'#b91c1c'" 
  [background]="'#fee2e2'" 
  [template]="warningDetails"
/>

<ng-template #warningDetails>
  <div style="padding: 12px; font-size: 13px;">
    <strong>Motivo de rechazo:</strong>
    <p>Falta comprobante fiscal de retención.</p>
  </div>
</ng-template>
```

---

### Personalización con Variables CSS (`--f24-*`)

```css
.status-custom-theme {
  --f24-status-font-size: 12px;
  --f24-status-border-radius: 50px;
  --f24-status-padding: 3px 8px;
}
```

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-status-border-radius` | `50px` | Radio de curvatura del badge (estilo píldora). |
| `--f24-status-padding` | `3px 8px` | Espaciado interior horizontal y vertical del badge. |
| `--f24-status-font-size` | `12px` | Tamaño de fuente de la tipografía del estado. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24StatusDemo") }}

### Playground

{{ NgDocActions.playground("F24StatusPlayground") }}
