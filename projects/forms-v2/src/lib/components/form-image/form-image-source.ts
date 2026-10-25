import { signal, untracked } from '@angular/core';
import { Field } from '@angular/forms/signals';

/**
 * F24FormImageUploaded
 * Representa una imagen o archivo que ya está subido en el servidor.
 * Se usa en escenarios de edición para mostrar los elementos asociados y
 * permitir marcarlos para eliminar.
 */
export interface F24FormImageUploaded {
  /**
   * id
   * código del registro en base de datos. Opcional para mantener compatibilidad
   * con subidas sin identificador; permite al procesar el submit saber qué
   * recurso representa cada elemento.
   */
  id?: string | number;
  /**
   * url
   * URL pública de la imagen o archivo ya subido.
   */
  url: string;
  /**
   * name
   * nombre opcional para la lista; si no se define se deduce de la URL.
   */
  name?: string;
  /**
   * size
   * tamaño en bytes; si no se define no se muestra en la previsualización.
   */
  size?: number;
  /**
   * type
   * MIME type del recurso. Si no se define se asume que es una imagen.
   */
  type?: string;
  /**
   * delete
   * marca de eliminación. El propio `f24-form-image` la escribe dentro del
   * valor del campo cuando el usuario marca o cancela la eliminación de una
   * subida. Al procesar el submit: los `File` se suben, los elementos con
   * `delete: true` se eliminan y el resto se conserva.
   */
  delete?: boolean;
}

/**
 * F24FormImageValue
 * Valor admitido por el campo del formulario: archivos nuevos seleccionados
 * por el usuario o imágenes/archivos ya subidos.
 */
export type F24FormImageValue = File | F24FormImageUploaded;

/**
 * F24ModelImage
 * Extiende cualquier modelo de negocio agregándole la propiedad `images` con
 * el tipo que recibe el componente `f24-form-image` en su campo del
 * formulario: `File` nuevos y `F24FormImageUploaded` ya subidos.
 */
export type F24ModelImage<Model extends {}> = Model & {
  images: F24FormImageValue[];
};

/**
 * F24FormImageSourceParams
 * Parámetros de configuración del componente `f24-form-image`.
 * Estos valores pueden pasarse directamente al source para centralizar la
 * presentación, la validación de formatos y la visibilidad de secciones.
 */
export interface F24FormImageSourceParams {
  /**
   * label
   * etiqueta mostrada en el `mat-form-field`.
   */
  label?: string;
  /**
   * appearance
   * apariencia del campo Material: `fill` u `outline`.
   */
  appearance?: 'fill' | 'outline';
  /**
   * name
   * nombre asignado al input de archivos.
   */
  name?: string;
  /**
   * placeholder
   * texto mostrado mientras no existan archivos seleccionados.
   */
  placeholder?: string;
  /**
   * accept
   * tipos MIME o extensiones permitidos.
   * Si no se define, el componente utiliza `image/*`.
   */
  accept?: string;
  /**
   * showInput
   * controla la visibilidad del `mat-form-field` principal.
   * Si no se define, el componente lo muestra.
   */
  showInput?: boolean;
  /**
   * showDropZone
   * controla la visibilidad de la zona de arrastrar y soltar.
   * Si no se define, el componente la muestra.
   */
  showDropZone?: boolean;
  /**
   * showPreviews
   * controla la visibilidad de la previsualización de cada archivo.
   * Esta visibilidad es independiente de la lista de archivos seleccionados.
   * Si no se define, el componente muestra la previsualización.
   */
  showPreviews?: boolean;
  /**
   * showSelectedList
   * controla la visibilidad de la lista de archivos seleccionados.
   * Si no se define, el componente muestra la lista.
   */
  showSelectedList?: boolean;
  /**
   * zoomClick
   * habilita o deshabilita el zoom modal del `f24-image` cuando se hace clic
   * sobre una miniatura.
   * Si no se define, el componente lo mantiene activo.
   */
  zoomClick?: boolean;
  /**
   * icon
   * nombre del icono mostrado en la zona de arrastrar y soltar.
   * Si no se define, el componente utiliza `cloud_upload`.
   */
  icon?: string;
  /**
   * iconSize
   * tamaño en píxeles del icono de la zona de arrastrar y soltar.
   * Si no se define, el componente utiliza `40`.
   */
  iconSize?: number;
  /**
   * title
   * título mostrado en la zona de arrastrar y soltar.
   * Si no se define, el componente utiliza `Arrastra y suelta archivos aquí`.
   */
  title?: string;
  /**
   * subtitle
   * subtítulo mostrado en la zona de arrastrar y soltar.
   * Si no se define, el componente utiliza `o haz clic para seleccionarlos`.
   */
  subtitle?: string;
  /**
   * form
   * campo de Signal Forms donde se guardará la lista de archivos.
   * Acepta `File` nuevos y `F24FormImageUploaded` ya subidos.
   */
  form?: Field<F24FormImageValue[]>;
}

/**
 * F24FormImageSource
 * Agrupa las señales de configuración del componente `f24-form-image`.
 * El source no realiza peticiones HTTP ni sube archivos; únicamente permite
 * compartir o parametrizar la presentación, los formatos permitidos y la
 * visibilidad de sus secciones mediante señales.
 */
export class F24FormImageSource {
  /**
   * label
   * señal de solo lectura con la etiqueta del campo.
   */
  protected readonly _label = signal<F24FormImageSourceParams['label']>(undefined);
  readonly label = this._label.asReadonly();
  /**
   * appearance
   * señal de solo lectura con la apariencia del `mat-form-field`.
   */
  protected readonly _appearance = signal<F24FormImageSourceParams['appearance']>(undefined);
  readonly appearance = this._appearance.asReadonly();
  /**
   * name
   * señal de solo lectura con el nombre asignado al input de archivos.
   */
  protected readonly _name = signal<F24FormImageSourceParams['name']>(undefined);
  readonly name = this._name.asReadonly();
  /**
   * placeholder
   * señal de solo lectura con el texto mostrado cuando no hay archivos.
   */
  protected readonly _placeholder = signal<F24FormImageSourceParams['placeholder']>(undefined);
  readonly placeholder = this._placeholder.asReadonly();
  /**
   * accept
   * señal de solo lectura con los formatos permitidos para seleccionar o
   * arrastrar imágenes y documentos.
   */
  protected readonly _accept = signal<F24FormImageSourceParams['accept']>(undefined);
  readonly accept = this._accept.asReadonly();
  /**
   * showInput
   * señal de solo lectura que indica si debe mostrarse el input principal.
   */
  protected readonly _showInput = signal<F24FormImageSourceParams['showInput']>(undefined);
  readonly showInput = this._showInput.asReadonly();
  /**
   * showDropZone
   * señal de solo lectura que indica si debe mostrarse la zona de arrastre.
   */
  protected readonly _showDropZone = signal<F24FormImageSourceParams['showDropZone']>(undefined);
  readonly showDropZone = this._showDropZone.asReadonly();
  /**
   * showPreviews
   * señal de solo lectura que indica si deben mostrarse las previsualizaciones
   * de los archivos.
   */
  protected readonly _showPreviews = signal<F24FormImageSourceParams['showPreviews']>(undefined);
  readonly showPreviews = this._showPreviews.asReadonly();
  /**
   * showSelectedList
   * señal de solo lectura que indica si debe mostrarse la lista de
   * archivos seleccionados.
   */
  protected readonly _showSelectedList =
    signal<F24FormImageSourceParams['showSelectedList']>(undefined);
  readonly showSelectedList = this._showSelectedList.asReadonly();
  /**
   * zoomClick
   * señal de solo lectura que indica si la miniatura debe permitir zoom al
   * hacer clic.
   */
  protected readonly _zoomClick = signal<F24FormImageSourceParams['zoomClick']>(undefined);
  readonly zoomClick = this._zoomClick.asReadonly();
  /**
   * icon
   * señal de solo lectura con el nombre del icono de la zona de arrastre.
   */
  protected readonly _icon = signal<F24FormImageSourceParams['icon']>(undefined);
  readonly icon = this._icon.asReadonly();
  /**
   * iconSize
   * señal de solo lectura con el tamaño del icono de la zona de arrastre.
   */
  protected readonly _iconSize = signal<F24FormImageSourceParams['iconSize']>(undefined);
  readonly iconSize = this._iconSize.asReadonly();
  /**
   * title
   * señal de solo lectura con el título de la zona de arrastre.
   */
  protected readonly _title = signal<F24FormImageSourceParams['title']>(undefined);
  readonly title = this._title.asReadonly();
  /**
   * subtitle
   * señal de solo lectura con el subtítulo de la zona de arrastre.
   */
  protected readonly _subtitle = signal<F24FormImageSourceParams['subtitle']>(undefined);
  readonly subtitle = this._subtitle.asReadonly();
  /**
   * form
   * señal de solo lectura con el `Field<F24FormImageValue[]>` de Signal Forms
   * enlazado al componente.
   */
  protected readonly _form = signal<F24FormImageSourceParams['form']>(undefined);
  readonly form = this._form.asReadonly();

  /**
   * Crea una instancia del source y aplica su configuración inicial.
   * @param params configuración inicial opcional.
   */
  constructor(params?: F24FormImageSourceParams) {
    this.update(params);
  }

  /**
   * Actualiza las señales del source.
   * Se prioriza `params`; si alguna propiedad no llega, se intenta usar
   * `params2` y, en último caso, se conserva el valor anterior.
   * @param params valores nuevos para el source.
   * @param params2 valores de respaldo para el source.
   * @returns void
   */
  public update(params?: F24FormImageSourceParams, params2?: F24FormImageSourceParams): void {
    untracked(() => {
      this._label.set(params?.label ?? params2?.label ?? this._label());
      this._appearance.set(params?.appearance ?? params2?.appearance ?? this._appearance());
      this._name.set(params?.name ?? params2?.name ?? this._name());
      this._placeholder.set(params?.placeholder ?? params2?.placeholder ?? this._placeholder());
      this._accept.set(params?.accept ?? params2?.accept ?? this._accept());
      this._showInput.set(params?.showInput ?? params2?.showInput ?? this._showInput());
      this._showDropZone.set(params?.showDropZone ?? params2?.showDropZone ?? this._showDropZone());
      this._showPreviews.set(params?.showPreviews ?? params2?.showPreviews ?? this._showPreviews());
      this._showSelectedList.set(
        params?.showSelectedList ?? params2?.showSelectedList ?? this._showSelectedList(),
      );
      this._zoomClick.set(params?.zoomClick ?? params2?.zoomClick ?? this._zoomClick());
      this._icon.set(params?.icon ?? params2?.icon ?? this._icon());
      this._iconSize.set(params?.iconSize ?? params2?.iconSize ?? this._iconSize());
      this._title.set(params?.title ?? params2?.title ?? this._title());
      this._subtitle.set(params?.subtitle ?? params2?.subtitle ?? this._subtitle());
      this._form.set(params?.form ?? params2?.form ?? this._form());
    });
  }
}

/**
 * createFormImageSource
 * Factory para crear un `F24FormImageSource` con configuración opcional.
 * @param params configuración inicial para el source.
 * @returns instancia de `F24FormImageSource`.
 */
export const createFormImageSource = (params?: F24FormImageSourceParams) => {
  return new F24FormImageSource(params);
};
