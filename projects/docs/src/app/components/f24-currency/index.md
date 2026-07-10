---
keyword: F24Currency
title: F24Currency
---

El componente `f24-currency` facilita la visualización estructurada de montos monetarios de forma simultánea en Bolívares (VES) y Dólares Estadounidenses (USD), permitiendo ocultar o mostrar cada divisa de manera independiente.

### Importación

Para usar este componente, impórtalo en tu componente o módulo:

```typescript
import { F24Currency } from '@f24/layout';
```

### Creación

Para crear este elemento usa esta etiqueta

```html
<f24-currency 
  [label]="'Monto Total'" 
  [ves]="150.50" 
  [usd]="3.50"
/>
```

{{ NgDocActions.demo("F24CurrencyDemo") }}


### Playground

{{ NgDocActions.playground("F24CurrencyPlayground") }}