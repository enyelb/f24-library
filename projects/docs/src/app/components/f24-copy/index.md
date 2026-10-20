---
keyword: F24Copy
title: F24Copy
---

El componente `f24-copy` permite a los usuarios copiar texto o valores al portapapeles del sistema operativo de manera inmediata con un solo clic. Utiliza internamente el CDK Clipboard de Angular Material y cambia reactivamente su icono por un estado de confirmación temporal durante 3 segundos tras cada copia exitosa.

### Importación

Para usar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Copy } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

Este componente opera directamente con tipos primitivos `string` en sus señales de entrada (`input()`).

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[copy]` | `string` | `undefined` | Texto o valor que se copiará al portapapeles al hacer clic. |
| `[text]` | `string` | `undefined` | Texto opcional a mostrar en el botón. Si se define, renderiza un `button[matButton]`; si no se define, renderiza un `button[matIconButton]` compacto. |

---

### Variables de Plantilla HTML / Contexto

- **Renderizado Condicional:** 
  - Cuando `text` está definido: renderiza un botón con texto e icono de estado (`done` o `content_copy`).
  - Cuando `text` no está definido: renderiza un botón de icono redondo compacto (`mat-icon-button`).
- **Estado Interno:** Maneja una señal interna reactiva `copied` que conmutará temporalmente el icono a `done` durante 3000ms después de disparar `onCopy()`.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico (Botón de Icono)

Ideal para tablas de datos, códigos de referencia o identificadores:

```html
<f24-copy [copy]="item.id" />
```

#### 2. Botón con Texto y Personalización Visual

Ideal para tarjetas de credenciales, tokens o formularios:

```html
<div class="copy-action-wrapper">
  <f24-copy [text]="'Copiar Clave Pública'" [copy]="userApiKey" />
</div>

<style>
.copy-action-wrapper {
  --f24-copy-color: var(--mat-sys-primary, #1976d2);
}
</style>
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--mat-sys-primary` | `undefined` | Color de énfasis del botón y del icono de confirmación. |
| `--f24-copy-color` | `inherit` | Color personalizado para el botón y textos de copia. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24CopyDemo") }}

### Playground

{{ NgDocActions.playground("F24CopyPlayground") }}
