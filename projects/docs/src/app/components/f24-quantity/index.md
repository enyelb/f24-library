---
keyword: F24Quantity
title: F24Quantity
---

El componente `f24-quantity` está diseñado para la visualización formateada de cantidades, métricas de inventario, contadores o unidades numéricas. Aplica automáticamente la transformación del pipe `f24tonumber`, admite un icono descriptivo (`f24-icon`), una etiqueta contextual (`label`) y tooltips de Angular Material.

### Importación

Para usar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Quantity } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

El componente acepta valores numéricos o cadenas convertibles a números para su entrada `[quantity]`.

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[quantity]` | `number \| string \| undefined` | *(Requerido)* | Valor numérico o texto a formatear y mostrar. |
| `[label]` | `string` | `undefined` | Etiqueta de texto descriptivo opcional ubicada arriba o junto a la cantidad. |
| `[icon]` | `string` | `undefined` | Nombre del icono descriptivo mostrado junto a la cantidad. |
| `[class]` | `string` | `undefined` | Clase CSS personalizada aplicada directamente sobre la etiqueta `span` del número. |
| `[tooltip]` | `string` | `undefined` | Mensaje emergente mostrado al hacer hover sobre el componente (`matTooltip`). |

---

### Variables de Plantilla HTML / Contexto

- **Formateo Numérico:** Procesa el valor mediante el pipe `f24tonumber` de `@f24/functions`.
- **Estructura Interna:** Genera `.f24-quantity`, `.f24-quantity-label` y `.f24-quantity-content` (con `f24-icon` y `span`).

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico

```html
<f24-quantity 
  [label]="'Stock Disponible:'" 
  [quantity]="1420" 
  [icon]="'inventory_2'" 
  [tooltip]="'Unidades en almacén central'"
/>
```

#### 2. Uso con Clases y Variables CSS Personalizadas

```html
<div class="metric-card">
  <f24-quantity 
    [label]="'Usuarios Activos'" 
    [quantity]="5240" 
    [icon]="'group'" 
    [class]="'highlight-metric'"
  />
</div>

<style>
.metric-card {
  --f24-quantity-label-color: #64748b;
  --f24-quantity-font-size: 16px;
  --f24-quantity-icon-color: #2563eb;
}

.metric-card .f24-quantity-label {
  color: var(--f24-quantity-label-color);
}

.metric-card .highlight-metric {
  font-size: var(--f24-quantity-font-size);
  color: var(--f24-quantity-icon-color);
  font-weight: 700;
}
</style>
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-quantity-label-color` | `inherit` | Color del texto de la etiqueta descriptiva. |
| `--f24-quantity-font-size` | `inherit` | Tamaño tipográfico del número formateado. |
| `--f24-quantity-icon-color` | `currentColor` | Color del icono que acompaña la cantidad. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24QuantityDemo") }}

### Playground

{{ NgDocActions.playground("F24QuantityPlayground") }}
