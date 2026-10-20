---
keyword: F24Container
title: F24Container
---

El componente `f24-container` (y su variante de selector `f24-container-two`) actúa como un contenedor visual estandarizado para envolver bloques de contenido, secciones o vistas dentro de la aplicación. Proporciona bordes redondeados consistentes, borde perimetral configurable y fondo adaptado al sistema de diseño.

### Importación

Para utilizar este componente, impórtalo en tu componente standalone o módulo:

```typescript
import { F24Container } from '@f24/layout';
```

### Tipos e Interfaces Relacionadas

Este componente no requiere tipos o interfaces adicionales para su consumo, ya que funciona mediante proyección de contenido estándar (`<ng-content>`).

---

### Propiedades y Parámetros (Inputs/Outputs)

El componente actúa como un contenedor estructural limpio y no expone entradas ni salidas explícitas.

| Parámetro | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| *(N/A)* | - | - | El componente proyecta contenido directamente mediante `<ng-content>`. |

---

### Variables de Plantilla HTML / Contexto

- **Slots de Proyección (`<ng-content>`):** Expone un único slot de proyección predeterminado (`<ng-content></ng-content>`) donde se renderiza todo el contenido HTML o componentes hijos pasados dentro del tag `<f24-container>`.
- **Selectores Soportados:** `f24-container`, `f24-container-two`.

---

### Demos y Ejemplos de Uso

#### 1. Uso Básico

Envolver tarjetas, secciones o formularios dentro de una vista:

```html
<f24-container>
  <div class="card-body">
    <h2>Información del Usuario</h2>
    <p>Detalles generales y preferencias de la cuenta.</p>
  </div>
</f24-container>
```

#### 2. Personalización con Clases y Variables CSS

Sobreescribe las variables de superficie y bordes para adaptarlo a temas personalizados o modo oscuro:

```html
<div class="custom-theme-wrapper">
  <f24-container>
    <section style="padding: 1rem;">
      <h3>Panel de Configuración</h3>
      <p>Contenido estilizado con variables de color personalizadas.</p>
    </section>
  </f24-container>
</div>

<style>
.custom-theme-wrapper {
  --border-primary: var(--f24-border-color, #94a3b8);
  --mat-sys-surface: var(--f24-container-bg, #f8fafc);
}
</style>
```

---

### Personalización con Variables CSS

El componente utiliza las siguientes custom properties para controlar su apariencia visual:

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `--border-primary` | `undefined` | Color del borde perimetral del contenedor (1px solid). |
| `--mat-sys-surface` | `undefined` | Color de fondo de la superficie del contenedor. |
| `--f24-container-bg` | *(Variable de aplicación)* | Permite mapear dinámicamente fondos personalizados. |

---

### Ejemplo Interactivo

{{ NgDocActions.demo("F24ContainerDemo") }}

### Playground

{{ NgDocActions.playground("F24ContainerPlayground") }}

