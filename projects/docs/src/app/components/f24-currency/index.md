---
keyword: F24Currency
title: F24Currency
---

El componente `f24-currency` facilita la visualización estructurada y formateada de montos monetarios simultáneos en Bolívares (VES) y Dólares Estadounidenses (USD). Aplica automáticamente formato monetario con el pipe `f24currency` y permite conmutar la visibilidad de cada divisa de forma independiente.

### Importación

Para usar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Currency } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

El componente acepta valores numéricos directos para las divisas y booleanos para alternar su visualización.

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[label]` | `string` | `undefined` | Etiqueta de texto descriptiva opcional sobre los importes. |
| `[ves]` | `number \| undefined` | *(Requerido)* | Monto en Bolívares (VES). Se formatea con el sufijo `Bs`. |
| `[showVes]` | `boolean` | `true` | Determina si se renderiza el valor en Bolívares. |
| `[usd]` | `number \| undefined` | *(Requerido)* | Monto en Dólares Estadounidenses (USD). Se formatea con el prefijo `$`. |
| `[showUsd]` | `boolean` | `true` | Determina si se renderiza el valor en Dólares. |

---

### Variables de Plantilla HTML / Contexto

- **Estructura Interna:** Genera una jerarquía con la clase base `.currency`, organizando las filas `.label`, `.usd` y `.ves`.
- **Formateo Automático:** Utiliza internamente los pipes `f24currency: 'VES'` y `f24currency: 'USD'` para una presentación homogénea.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico Bimonetario

```html
<f24-currency 
  [label]="'Monto Total'" 
  [ves]="3450.75" 
  [usd]="75.00"
/>
```

#### 2. Visualización Unidivisa con Variables Personalizadas

```html
<div class="custom-pricing-box">
  <f24-currency 
    [label]="'Tarifa Mensual'" 
    [usd]="19.99"
    [ves]="920.50"
    [showVes]="false"
  />
</div>

<style>
.custom-pricing-box {
  --red-color: var(--f24-currency-usd-color, #dc2626);
  --primary-color: var(--f24-currency-ves-color, #16a34a);
}
</style>
```

---

### Personalización con Variables CSS

El componente permite sobreescribir los colores característicos de cada divisa mediante variables CSS:

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--primary-color` / `--seped-main-color` | `green` | Color aplicado a la visualización de Bolívares (VES). |
| `--red-color` / `--seped-red-color` | `#ff0f27` | Color aplicado a la visualización de Dólares (USD). |
| `--f24-currency-usd-color` | *(Variable de aplicación)* | Permite personalizar el tono del valor en USD. |
| `--f24-currency-ves-color` | *(Variable de aplicación)* | Permite personalizar el tono del valor en VES. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24CurrencyDemo") }}

### Playground

{{ NgDocActions.playground("F24CurrencyPlayground") }}
