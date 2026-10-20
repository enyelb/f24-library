Actúa como un desarrollador Frontend Senior especializado en Angular y ng-doc. Tu tarea es generar el archivo de documentación completo para un componente de mi librería Angular.

El archivo debe usar la estructura y sintaxis estándar de ng-doc (`.ng-doc.ts` y `.md`).

Instrucciones de generación:

1. Estructura ng-doc:
   - Define el objeto `NgDocPage` con su título, categoría, palabra clave (`keyword`) y la ruta al template Markdown.

2. Contenido del Markdown:
   - Descripción General: Explicación concisa sobre la responsabilidad y propósito del componente.
   - Importación e Instalación:
     - Muestra cómo importar el componente standalone, módulo o tipos necesarios.
     - Detalla la lista explícita de tipos, interfaces, enums o tipos de parámetros que acepta en sus `@Input()` / `@Output()` o Signals (`input()`, `output()`).
   - Propiedades y Parámetros (Inputs/Outputs):
     - Tabla detallada con: Parámetro, Tipo, Valor por defecto y Descripción.
   - Variables de Plantilla HTML / Contexto:
     - Explica si el componente expone variables a través de `let-*` en templates (`ng-template`), `exportAs` o slots con `<ng-content>`. Muestra exactamente el contexto disponible.
   - Demos / Ejemplos de uso:
     - Incluye bloques de código de uso básico y avanzado.
     - Añade los tags/sintaxis de demo de ng-doc (`<ng-doc-demo ...>`).
     - **Importante:** En los ejemplos HTML/CSS de los demos donde se apliquen estilos personalizados o temas, utiliza explícitamente la convención de variables `--f24-*` (por ejemplo: `--f24-primary-color`, `--f24-padding`, etc.) para mostrar a los usuarios cómo sobreescribirlas.
   - Personalización con Variables CSS (`--f24`):
     - Agrega una sección dedicada que liste todas las variables CSS nativas o custom properties con el prefijo `--f24` soportadas por el componente.
     - Incluye una tabla con: Variable (`--f24-*`), Valor por defecto y Explicación de lo que controla/modifica en la interfaz.