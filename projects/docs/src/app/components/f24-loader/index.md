---
keyword: F24Loader
title: F24Loader
---

El componente `f24-loader` es un indicador visual de carga animado (*spinner*). Presenta un anillo perimetral con gradiente y rotación CSS de doble arco, en cuyo centro se posiciona un icono (`f24-icon`) configurable para reforzar la identidad visual o el contexto de la acción en curso.

### Importación

Para usar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Loader } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

El componente utiliza entradas directas de tipo `boolean` y `string`.

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[isLoading]` | `boolean` | `true` | Determina si el indicador de carga se muestra visible o se oculta. |
| `[icon]` | `string` | `'patricio'` | Nombre del icono central renderizado mediante `f24-icon` (fuente Material, SVG o GIF). |

---

### Variables de Plantilla HTML / Contexto

- **Estructura Interna:** Genera `.container-loader` con una animación continua `@keyframes rotation` de 1s de período.
- **Centrado Automático:** Aplica estilos flexbox completos para centrar el spinner vertical y horizontalmente dentro de su contenedor padre.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico

```html
<f24-loader [isLoading]="isFetchingData" />
```

#### 2. Personalización de Icono y Contenedor con Variables CSS

```html
<div class="loader-custom-wrapper">
  <f24-loader [isLoading]="true" [icon]="'hourglass_empty'" />
</div>

<style>
.loader-custom-wrapper {
  --f24-loader-size: 68px;
  --f24-loader-border-width: 4px;
  --f24-loader-primary-color: #ff0f27;
  --f24-loader-secondary-color: #2794ff;
  min-height: 200px;
  display: flex;
}
</style>
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-loader-size` | `68px` | Diámetro exterior del anillo giratorio del loader. |
| `--f24-loader-primary-color` | `#ff0f27` | Color del arco superior de la animación giratoria. |
| `--f24-loader-secondary-color` | `#2794ff` | Color del arco inferior de la animación giratoria. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24LoaderDemo") }}

### Playground

{{ NgDocActions.playground("F24LoaderPlayground") }}
