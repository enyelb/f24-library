---
keyword: F24Divider
title: F24Divider
---

El componente `f24-divider` es un separador visual mejorado que envuelve y extiende `<mat-divider>` de Angular Material. Permite incorporar opcionalmente texto central (título) y/o un icono de Material Icons entre dos líneas divisorias, ideal para formularios de login ("O inicia sesión con"), secciones de configuración o particiones temáticas.

### Importación

Para usar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Divider } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

El componente utiliza tipos escalares para título e icono y el tipo de unión `'horizontal' | 'vertical'` para su orientación.

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[title]` | `string` | `undefined` | Texto o etiqueta que se muestra centrado entre las líneas del divisor. |
| `[icon]` | `string` | `undefined` | Nombre del icono de Material Icons a renderizar junto al texto. |
| `[orientation]` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación del divisor. |

---

### Variables de Plantilla HTML / Contexto

- **Renderizado Dinámico:** Si se proporciona un `title` o `icon`, el componente renderiza automáticamente dos segmentos de `<mat-divider>` a los lados del contenido central; si no se proporcionan, renderiza una sola línea divisoria.
- **Slots:** No utiliza `<ng-content>`, el contenido textual e icono se inyectan a través de sus inputs.

---

### Demos y Ejemplos de Uso

#### 1. Divisor con Texto

```html
<f24-divider [title]="'O continúa con'" />
```

#### 2. Divisor con Icono y Estilos Personalizados

```html
<div class="custom-divider-wrapper">
  <f24-divider [icon]="'security'" [title]="'Acceso Autenticado'" />
</div>

<style>
.custom-divider-wrapper {
  --f24-divider-padding: 16px 8px;
  --f24-divider-color: #64748b;
}

.custom-divider-wrapper .f24-divider span,
.custom-divider-wrapper .f24-divider mat-icon {
  color: var(--f24-divider-color);
}
</style>
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-divider-padding` | `20px 10px` | Espaciado vertical y horizontal alrededor del divisor. |
| `--f24-divider-color` | `inherit` | Color del texto e icono del separador. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24DividerDemo") }}

### Playground

{{ NgDocActions.playground("F24DividerPlayground") }}
