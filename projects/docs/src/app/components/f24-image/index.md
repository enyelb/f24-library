---
keyword: F24Image
title: F24Image
---

El componente `f24-image` proporciona una solución robusta para renderizado de imágenes en la interfaz. Incluye soporte nativo para carga diferida (`loading="lazy"`), manejo inteligente de errores con imagen por defecto de respaldo (*fallback*) en caso de fallos de red o URLs inválidas, y visualización modal ampliada (*lightbox / zoom*) al hacer clic mediante `F24Dialog`.

### Importación

Para utilizar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Image } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

```typescript
export type F24ImageZoomSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
```

---

### Propiedades y Parámetros (Inputs/Outputs)

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `[src]` | `string` | `''` | URL principal de la imagen a cargar. |
| `[alt]` | `string` | `''` | Texto alternativo descriptivo de la imagen para accesibilidad (`alt`). |
| `[default]` | `string` | `''` | URL de la imagen de respaldo (*fallback*) mostrada si la principal falla o está vacía. |
| `[zoomClick]` | `boolean` | `true` | Habilita la apertura de un modal (`F24Dialog`) con la imagen en alta resolución al hacer clic. |
| `[zoomSize]` | `'xs' \| 's' \| 'm' \| 'l' \| 'xl' \| 'xxl'` | `'s'` | Dimensión del diálogo modal cuando `zoomClick` está activo. |

---

### Variables de Plantilla HTML / Contexto

- **Fallback Automático:** En caso de que la imagen principal no cargue, el evento `(error)` dispara `reportError()`, cambiando reactivamente a la URL provista en `[default]`.
- **Integración con Dialog:** Incrusta internamente `<f24-dialog>` para presentar la imagen ampliada con bordes redondeados y ajuste responsivo.

---

### Demos y Ejemplos de Uso

#### 1. Uso Estándar con Zoom Habilitado

```html
<f24-image 
  [src]="user.avatarUrl" 
  [alt]="user.fullName" 
  [zoomClick]="true" 
  [zoomSize]="'m'"
/>
```

#### 2. Imagen con URL de Respaldo y Clases Personalizadas

```html
<div class="product-thumbnail">
  <f24-image 
    [src]="product.imageUrl" 
    [default]="'assets/images/product-placeholder.png'" 
    [alt]="product.name"
    [zoomClick]="false"
  />
</div>

<style>
.product-thumbnail {
  --f24-image-height: 60px;
  --f24-image-border-radius: 12px;
}

.product-thumbnail .f24-image {
  height: var(--f24-image-height);
  border-radius: var(--f24-image-border-radius);
}
</style>
```

---

### Personalización con Variables CSS

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--f24-image-height` | `45px` | Altura estándar de la imagen miniatura. |
| `--f24-image-border-radius` | `10px` | Radio de los bordes redondeados de la imagen. |
| `--f24-image-zoom-border-radius` | `20px` | Radio de borde de la imagen ampliada en el modal. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24ImageDemo") }}

### Playground

{{ NgDocActions.playground("F24ImagePlayground") }}
