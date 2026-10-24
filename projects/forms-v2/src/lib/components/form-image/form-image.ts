import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { F24Icon, F24Image } from '@f24/layout';

import { F24FormErrors } from '../form-errors';
import { F24FormImageSource, F24FormImageSourceParams } from './form-image-source';

/**
 * F24FormImagePreview
 * Representa un archivo dentro del listado de previsualizaciones.
 * `url` contiene una miniatura solo para imágenes; en documentos u otros
 * tipos será `null` para que el template muestre un icono genérico.
 */
interface F24FormImagePreview {
  /**
   * Archivo original seleccionado o soltado.
   */
  file: File;
  /**
   * Object URL de la imagen, o `null` cuando no aplica una miniatura.
   */
  url: string | null;
}

/**
 * F24FormImage
 * Componente standalone para seleccionar imágenes y otros documentos dentro
 * de un formulario de Signal Forms.
 *
 * Comportamiento:
 * - Permite selección múltiple mediante input nativo y arrastrar/soltar.
 * - Valida formatos usando `accept`.
 * - Mantiene el valor del campo como `File[]`.
 * - Muestra previsualizaciones de imágenes e iconos para documentos.
 * - Permite mostrar u ocultar las previsualizaciones mediante `showPreviews`
 *   y la lista de archivos seleccionados mediante `showSelectedList`.
 * - Permite ocultar el input principal y la zona de arrastre con `showInput`
 *   y `showDropZone`.
 * - Permite configurar el zoom de la imagen con `zoomClick`.
 * - No sube archivos a un servidor ni hace peticiones HTTP.
 * - Sigue el patrón `source + inputs + computed resolved` de `forms-v2`.
 */
@Component({
  selector: 'f24-form-image',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, F24Icon, F24Image, F24FormErrors],
  templateUrl: './form-image.html',
  styleUrl: './form-image.scss',
})
export class F24FormImage {
  /**
   * source
   * Configuración reactiva opcional del componente.
   * Si se define, sus señales tienen prioridad sobre los inputs locales.
   */
  readonly source = input<F24FormImageSource>();
  /**
   * label
   * etiqueta mostrada en el `mat-form-field`.
   */
  readonly label = input<F24FormImageSourceParams['label']>();
  /**
   * appearance
   * apariencia del campo Material: `fill` u `outline`.
   */
  readonly appearance = input<F24FormImageSourceParams['appearance']>();
  /**
   * name
   * nombre asignado al input nativo de archivos.
   */
  readonly name = input<F24FormImageSourceParams['name']>();
  /**
   * placeholder
   * texto mostrado en el campo cuando todavía no hay archivos.
   */
  readonly placeholder = input<F24FormImageSourceParams['placeholder']>();
  /**
   * accept
   * lista de tipos MIME, comodines o extensiones permitidas.
   * Ejemplos: `image/*`, `.pdf`, `application/pdf,image/*`.
   */
  readonly accept = input<F24FormImageSourceParams['accept']>();
  /**
   * showInput
   * si es `false`, oculta el `mat-form-field` principal.
   */
  readonly showInput = input<F24FormImageSourceParams['showInput']>();
  /**
   * showDropZone
   * si es `false`, oculta la zona para arrastrar y soltar archivos.
   */
  readonly showDropZone = input<F24FormImageSourceParams['showDropZone']>();
  /**
   * showPreviews
   * si es `false`, oculta la previsualización de cada archivo.
   * Esta visibilidad es independiente de la lista de archivos seleccionados.
   */
  readonly showPreviews = input<F24FormImageSourceParams['showPreviews']>();
  /**
   * showSelectedList
   * si es `false`, oculta la lista de archivos seleccionados, incluyendo el
   * encabezado y los botones de limpieza.
   * Esta sección es independiente de la galería de previews.
   */
  readonly showSelectedList = input<F24FormImageSourceParams['showSelectedList']>();
  /**
   * zoomClick
   * si es `true`, permite abrir el zoom modal de la miniatura al hacer clic.
   * Si es `false`, la miniatura se mantiene estática.
   * Por defecto es `true`.
   */
  readonly zoomClick = input<F24FormImageSourceParams['zoomClick']>();
  /**
   * form
   * campo de Signal Forms tipado con `Field<File[]>`.
   * Aquí se almacenarán los archivos seleccionados por el usuario.
   */
  readonly form = input<F24FormImageSourceParams['form']>();
  /**
   * resolvedLabel
   * Combina el source, el input local y su valor por defecto para obtener la
   * etiqueta final.
   * @returns etiqueta usable en el template.
   */
  readonly resolvedLabel = computed(() => this.source()?.label() ?? this.label() ?? '');
  /**
   * resolvedAppearance
   * Combina el source, el input local y el valor por defecto `outline`.
   * @returns apariencia final del `mat-form-field`.
   */
  readonly resolvedAppearance = computed(
    () => this.source()?.appearance() ?? this.appearance() ?? 'outline',
  );
  /**
   * resolvedName
   * Combina el source y el input local, usando cadena vacía como respaldo.
   * @returns nombre final para el input de archivos.
   */
  readonly resolvedName = computed(() => this.source()?.name() ?? this.name() ?? '');
  /**
   * resolvedPlaceholder
   * Combina el source, el input local y el placeholder por defecto.
   * @returns placeholder final del campo de texto solo lectura.
   */
  readonly resolvedPlaceholder = computed(
    () => this.source()?.placeholder() ?? this.placeholder() ?? 'Ningún archivo seleccionado',
  );
  /**
   * resolvedAccept
   * Combina el source, el input local y `image/*` como valor por defecto.
   * @returns cadena `accept` final para validar y filtrar archivos.
   */
  readonly resolvedAccept = computed(() => this.source()?.accept() ?? this.accept() ?? 'image/*');
  /**
   * resolvedShowInput
   * Combina el source, el input local y el valor visible por defecto.
   * @returns true si debe mostrarse el `mat-form-field` principal.
   */
  readonly resolvedShowInput = computed(
    () => this.source()?.showInput() ?? this.showInput() ?? true,
  );
  /**
   * resolvedShowDropZone
   * Combina el source, el input local y el valor visible por defecto.
   * @returns true si debe mostrarse la zona de arrastrar y soltar.
   */
  readonly resolvedShowDropZone = computed(
    () => this.source()?.showDropZone() ?? this.showDropZone() ?? true,
  );
  /**
   * resolvedShowPreviews
   * Combina el source, el input local y el valor visible por defecto.
   * @returns true si deben mostrarse las previsualizaciones de los archivos.
   */
  readonly resolvedShowPreviews = computed(
    () => this.source()?.showPreviews() ?? this.showPreviews() ?? true,
  );
  /**
   * resolvedShowSelectedList
   * Combina el source, el input local y el valor visible por defecto.
   * @returns true si debe mostrarse la lista de archivos seleccionados.
   */
  readonly resolvedShowSelectedList = computed(
    () => this.source()?.showSelectedList() ?? this.showSelectedList() ?? true,
  );
  /**
   * resolvedZoomClick
   * Combina el source, el input local y el valor activo por defecto.
   * @returns true si la miniatura debe permitir zoom al hacer clic.
   */
  readonly resolvedZoomClick = computed(
    () => this.source()?.zoomClick() ?? this.zoomClick() ?? true,
  );
  /**
   * resolvedForm
   * Combina el source y el input local.
   * @returns `Field<File[]>` si existe; en caso contrario, `null`.
   */
  readonly resolvedForm = computed(() => this.source()?.form() ?? this.form() ?? null);
  /**
   * resolvedDisabled
   * Lee el estado `disabled` del `FieldState` asociado.
   * @returns true cuando el campo está deshabilitado.
   */
  readonly resolvedDisabled = computed(() => this.resolvedForm()?.().disabled() ?? false);
  /**
   * fieldState
   * Obtiene el `FieldState<File[]>` del campo resuelto.
   * @returns estado del signal form o `undefined` si no existe campo.
   */
  protected readonly fieldState = computed(() => this.resolvedForm()?.());
  /**
   * files
   * Lista actual de archivos guardados en el campo.
   * @returns arreglo de `File`; devuelve un array vacío si no hay campo o
   * el valor todavía no está disponible.
   */
  protected readonly files = computed(() => this.fieldState()?.controlValue() ?? []);
  /**
   * fileSummary
   * Texto resumen mostrado en el input solo lectura de Material.
   * @returns cadena vacía si no hay archivos, el nombre si hay uno o un
   * recuento si hay varios.
   */
  protected readonly fileSummary = computed(() => {
    const files = this.files();
    if (files.length === 0) {
      return '';
    }
    return files.length === 1 ? files[0].name : `${files.length} archivos seleccionados`;
  });
  /**
   * isDragging
   * Controla el estilo visual de la zona de drop mientras el usuario arrastra
   * archivos sobre ella.
   */
  protected readonly isDragging = signal(false);
  /**
   * localError
   * Mensaje mostrado cuando un archivo es rechazado por `accept`.
   * No sustituye los errores del propio Signal Forms.
   */
  protected readonly localError = signal<string | null>(null);
  /**
   * previews
   * Listado de previsualizaciones derivado de los archivos actuales.
   * Cada imagen tendrá una object URL y los documentos tendrán `url: null`.
   */
  protected readonly previews = signal<F24FormImagePreview[]>([]);

  /**
   * Referencia de destrucción para liberar object URLs al destruir el
   * componente.
   */
  private readonly destroyRef = inject(DestroyRef);
  /**
   * Caché de object URLs asociadas a cada `File`.
   * Se reutilizan para no crear varias miniaturas del mismo archivo.
   */
  private readonly previewUrls = new Map<File, string>();
  /**
   * Contador de entradas/salidas del arrastre.
   * Evita que el estado visual parpadee cuando el puntero entra en hijos de
   * la zona de drop.
   */
  private dragDepth = 0;
  /**
   * Crea el componente y registra dos comportamientos:
   * - un efecto que sincroniza previsualizaciones y libera URLs no usadas;
   * - una limpieza al destruir el componente.
   */
  constructor() {
    effect(() => {
      const files = this.files();
      this.revokeUnusedPreviewUrls(files);
      const previews = files.map((file) => ({
        file,
        url: this.isImage(file) ? this.getPreviewUrl(file) : null,
      }));
      untracked(() => this.previews.set(previews));
    });

    this.destroyRef.onDestroy(() => {
      for (const url of this.previewUrls.values()) {
        this.revokePreviewUrl(url);
      }
      this.previewUrls.clear();
    });
  }

  /**
   * Abre el selector nativo de archivos si el campo no está deshabilitado.
   * @param fileInput input HTML tipo `file` que contiene los archivos.
   * @returns void
   */
  protected openFileSelector(fileInput: HTMLInputElement): void {
    if (!this.resolvedDisabled()) {
      fileInput.click();
    }
  }

  /**
   * Procesa los archivos elegidos desde el selector nativo.
   * Valida los formatos, agrega los aceptados y limpia el input para permitir
   * volver a seleccionar el mismo archivo.
   * @param event evento `change` producido por el input de archivos.
   * @returns void
   */
  protected onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    this.addFiles(Array.from(fileInput.files ?? []));
    fileInput.value = '';
  }

  /**
   * Registra la entrada de un arrastre con archivos.
   * Incrementa la profundidad de arrastre y activa el estilo de drop.
   * @param event evento `dragenter`.
   * @returns void
   */
  protected onDragEnter(event: DragEvent): void {
    if (!this.hasDraggedFiles(event)) {
      return;
    }
    this.stopEvent(event);
    if (this.resolvedDisabled()) {
      return;
    }
    this.dragDepth++;
    this.isDragging.set(true);
  }

  /**
   * Permite soltar archivos sobre la zona.
   * También actualiza el cursor del navegador a `copy` cuando el campo está
   * habilitado.
   * @param event evento `dragover`.
   * @returns void
   */
  protected onDragOver(event: DragEvent): void {
    if (!this.hasDraggedFiles(event)) {
      return;
    }
    this.stopEvent(event);
    if (this.resolvedDisabled()) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
      return;
    }
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.isDragging.set(true);
  }

  /**
   * Reduce el contador de arrastre cuando el puntero sale de la zona.
   * Limpia el estado visual únicamente si la profundidad llega a cero.
   * @param event evento `dragleave`.
   * @returns void
   */
  protected onDragLeave(event: DragEvent): void {
    this.stopEvent(event);
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) {
      this.isDragging.set(false);
    }
  }

  /**
   * Procesa los archivos soltados en la zona de drop.
   * Reinicia el estado visual, filtra los formatos permitidos y actualiza el
   * `Field<File[]>`.
   * @param event evento `drop`.
   * @returns void
   */
  protected onDrop(event: DragEvent): void {
    this.stopEvent(event);
    this.resetDragState();
    if (this.resolvedDisabled()) {
      return;
    }
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  /**
   * Elimina un archivo concreto del campo mediante su posición.
   * @param index índice del archivo dentro de `files()`.
   * @returns void
   */
  protected removeFile(index: number): void {
    if (this.resolvedDisabled()) {
      return;
    }
    this.updateFiles(this.files().filter((_, fileIndex) => fileIndex !== index));
  }

  /**
   * Elimina todos los archivos del campo y limpia el error local de formatos.
   * @returns void
   */
  protected clearFiles(): void {
    if (this.resolvedDisabled()) {
      return;
    }
    this.localError.set(null);
    this.updateFiles([]);
  }

  /**
   * Marca el campo como touched cuando el usuario interactúa con él y sale
   * de los controles principales.
   * @returns void
   */
  protected markAsTouched(): void {
    this.fieldState()?.markAsTouched();
  }

  /**
   * Convierte el tamaño de un archivo a una etiqueta legible en español.
   * @param size tamaño del archivo en bytes.
   * @returns texto formateado con unidad `B`, `KB`, `MB` o `GB`.
   */
  protected formatFileSize(size: number): string {
    if (size === 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
    const value = size / 1024 ** unitIndex;
    return `${new Intl.NumberFormat('es', { maximumFractionDigits: 1 }).format(value)} ${units[unitIndex]}`;
  }

  /**
   * Devuelve el icono Material usado cuando no se muestra una miniatura.
   * @param file archivo de la fila actual.
   * @returns `image` para imágenes y `description` para otros documentos.
   */
  protected getPreviewIcon(file: File): string {
    return this.isImage(file) ? 'image' : 'description';
  }

  /**
   * Filtra archivos permitidos, establece el error local si hay rechazos y
   * agrega los aceptados al final de la lista actual.
   * @param files archivos recibidos desde el input o desde `drop`.
   * @returns void
   */
  private addFiles(files: File[]): void {
    if (files.length === 0 || this.resolvedDisabled()) {
      return;
    }

    const acceptedFiles = files.filter((file) => this.isAccepted(file));
    const rejectedFiles = files.length - acceptedFiles.length;
    this.localError.set(
      rejectedFiles > 0
        ? `${rejectedFiles === 1 ? 'Un archivo no tiene' : `${rejectedFiles} archivos no tienen`} un formato permitido. Formatos: ${this.resolvedAccept()}`
        : null,
    );

    if (acceptedFiles.length > 0) {
      this.updateFiles([...this.files(), ...acceptedFiles]);
    }
  }

  /**
   * Escribe la lista de archivos en el `Field<File[]>` asociado.
   * También marca el campo como dirty y touched.
   * @param files lista final que quedará en el formulario.
   * @returns void
   */
  private updateFiles(files: File[]): void {
    const state = this.fieldState();
    if (!state) {
      return;
    }
    state.controlValue.set(files);
    state.markAsDirty();
    state.markAsTouched();
  }

  /**
   * Comprueba si un archivo coincide con la cadena `accept` resuelta.
   * Soporta tipos MIME exactos, comodines como `image/*` y extensiones como
   * `.pdf`.
   * @param file archivo a validar.
   * @returns true si el archivo es permitido.
   */
  private isAccepted(file: File): boolean {
    const acceptedTypes = this.resolvedAccept()
      .split(',')
      .map((type) => type.trim().toLowerCase())
      .filter(Boolean);

    if (acceptedTypes.length === 0 || acceptedTypes.includes('*/*')) {
      return true;
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return acceptedTypes.some((acceptedType) => {
      if (acceptedType.startsWith('.')) {
        return fileName.endsWith(acceptedType);
      }
      if (acceptedType.endsWith('/*')) {
        return fileType.startsWith(acceptedType.slice(0, -1));
      }
      return fileType === acceptedType;
    });
  }

  /**
   * Determina si el MIME type del archivo corresponde a una imagen.
   * @param file archivo evaluado.
   * @returns true si el archivo empieza por `image/`.
   */
  protected isImage(file: File): boolean {
    return file.type.toLowerCase().startsWith('image/');
  }

  /**
   * Obtiene o crea la object URL de una imagen para mostrar su miniatura.
   * @param file archivo de imagen.
   * @returns URL generada para el preview, o `null` si el entorno no soporta
   * `URL.createObjectURL`.
   */
  private getPreviewUrl(file: File): string | null {
    const currentUrl = this.previewUrls.get(file);
    if (currentUrl) {
      return currentUrl;
    }
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return null;
    }
    const url = URL.createObjectURL(file);
    this.previewUrls.set(file, url);
    return url;
  }

  /**
   * Libera las object URLs cuyos archivos ya no existen en la lista actual.
   * @param files archivos vigentes tras el último cambio del campo.
   * @returns void
   */
  private revokeUnusedPreviewUrls(files: File[]): void {
    const currentFiles = new Set(files);
    for (const [file, url] of this.previewUrls) {
      if (!currentFiles.has(file)) {
        this.revokePreviewUrl(url);
        this.previewUrls.delete(file);
      }
    }
  }

  /**
   * Revoca una object URL si el entorno expone `URL.revokeObjectURL`.
   * @param url object URL a liberar.
   * @returns void
   */
  private revokePreviewUrl(url: string): void {
    if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Comprueba si el `DataTransfer` de un evento de arrastre contiene archivos.
   * @param event evento nativo de drag.
   * @returns true si `types` incluye `Files`.
   */
  private hasDraggedFiles(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types ?? []).includes('Files');
  }

  /**
   * Evita el comportamiento predeterminado del navegador y propaga el evento
   * de forma controlada.
   * @param event evento nativo detenido.
   * @returns void
   */
  private stopEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Restablece la profundidad y el estado visual del arrastre.
   * @returns void
   */
  private resetDragState(): void {
    this.dragDepth = 0;
    this.isDragging.set(false);
  }
}
