import { 
  ChangeDetectionStrategy, 
  Component, 
  contentChild, 
  effect, 
  ElementRef, 
  inject, 
  input, 
  viewChild, 
  ViewEncapsulation, 
  OnDestroy,
  signal,
  computed
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { F24SplideLoader } from '../../services/splide-loader';
import { F24SplideItemDirective } from '../../directives/splide-item';

import { createSplideSource, createSplideSourceParams, F24SplideSourceParams } from './splide-source';

@Component({
  selector: 'f24-splide',
  imports: [NgTemplateOutlet],
  templateUrl: './splide.html',
  styleUrl: './splide.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Splide<Item> implements OnDestroy {
  /**
   * services
   */
  readonly loader = inject(F24SplideLoader);
  
  /**
   * source 
   */
  readonly params = input(createSplideSourceParams<Item>());
  readonly source = input(createSplideSource<Item>());
  
  /**
   * inputs
   */
  readonly id = input<F24SplideSourceParams<Item>['id']>();
  readonly items = input<F24SplideSourceParams<Item>['items']>();
  readonly options = input<F24SplideSourceParams<Item>['options']>();
  readonly autoScroll = input<F24SplideSourceParams<Item>['autoScroll']>();
  readonly defaults = input<F24SplideSourceParams<Item>['defaults']>();
  
  /**
   * elements
   */
  readonly root = viewChild('splideRoot', { read: ElementRef<HTMLElement> });
  readonly template = contentChild.required(F24SplideItemDirective<Item>);
  
  /**
   * splide
   */
  private splide: any;
  private isInitialized = false;
  private currentItemsLength = 0;
  private destroyTimeout: any;
  
  // Señal para forzar la reconstrucción del DOM
  private forceRefresh = signal(0);
  
  protected trackIdRandom = `splide-${Math.random()}`;
  protected trackIdRandomFn = (index: number) => `${this.trackIdRandom}-${index}`;
  
  /**
   * Computed para trackId que cambia cuando los items cambian
   */
  protected trackId = computed(() => {
    // Forzar actualización cuando cambian los items
    this.source().items();
    this.forceRefresh();
    return `splide-${Math.random()}`;
  });

  /**
   * constructor
   */
  constructor() {
    /**
     * Efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        id: this.id(),
        items: this.items(),
        options: this.options(),
        defaults: this.defaults(),
        autoScroll: this.autoScroll()
      }, this.params());
    });

    /**
     * EFECTO PRINCIPAL: Maneja cambios en items y options
     */
    effect(() => {
      const root = this.root();
      if (!root) {
        return;
      }

      // Leer todas las señales que nos interesan
      const items = this.source().items();
      const options = this.source().options();
      const defaults = this.source().defaults();
      const autoScroll = this.source().autoScroll();
      const newItemsLength = items?.length || 0;

      // Si no hay items, destruir y salir
      if (newItemsLength === 0) {
        if (this.splide) {
          this.splide.destroy();
          this.splide = null;
          this.isInitialized = false;
        }
        return;
      }

      // Verificar si cambiaron los items (cantidad o contenido)
      const itemsChanged = this.currentItemsLength !== newItemsLength;
      
      // Si cambiaron los items, forzar refresco completo
      if (itemsChanged) {
        this.currentItemsLength = newItemsLength;
        this.forceRefresh.set(this.forceRefresh() + 1);
        
        // Pequeño delay para que Angular renderice los nuevos items
        setTimeout(() => {
          this.reinitializeSplide(root.nativeElement, defaults, options, autoScroll);
        }, 50);
        return;
      }

      // Si solo cambiaron opciones, actualizar sin recrear
      if (this.splide && this.isInitialized) {
        this.updateSplideOptions(options, autoScroll);
      }
    });
  }

  /**
   * Reinitializa el Splide completamente
   */
  private reinitializeSplide(element: HTMLElement, defaults: any, options: any, autoScroll: any) {
    // Limpiar timeout anterior
    if (this.destroyTimeout) {
      clearTimeout(this.destroyTimeout);
      this.destroyTimeout = null;
    }

    // Destruir instancia anterior
    if (this.splide) {
      this.splide.destroy();
      this.splide = null;
      this.isInitialized = false;
    }

    // Esperar un tick para asegurar que el DOM está listo
    this.destroyTimeout = setTimeout(() => {
      // Crear nueva instancia
      this.splide = this.loader.inizialized(
        element, 
        defaults, 
        options, 
        { autoScroll }
      );
      this.isInitialized = true;
      this.destroyTimeout = null;
    }, 100);
  }

  /**
   * Actualiza opciones del Splide sin recrearlo
   */
  private updateSplideOptions(options: any, autoScroll: any) {
    if (!this.splide || !this.splide.splide) {
      return;
    }

    try {
      // Actualizar opciones de autoplay
      if (autoScroll) {
        this.splide.options.autoplay = true;
        if (autoScroll.speed) {
          this.splide.options.interval = autoScroll.speed;
        }
        if (autoScroll.direction) {
          this.splide.options.direction = autoScroll.direction;
        }
        
        // Si estaba pausado, reiniciar
        if (this.splide.splide.isPaused()) {
          this.splide.splide.play();
        }
      } else {
        this.splide.options.autoplay = false;
        if (this.splide.splide.isPlaying()) {
          this.splide.splide.pause();
        }
      }

      // Actualizar otras opciones
      if (options) {
        Object.assign(this.splide.options, options);
      }

      // Refrescar el Splide para aplicar cambios
      this.splide.splide.refresh();
      
    } catch (error) {
      console.warn('Error updating Splide options:', error);
      // Si falla, reconstruir
      const root = this.root();
      if (root) {
        this.reinitializeSplide(
          root.nativeElement, 
          this.source().defaults(), 
          options, 
          autoScroll
        );
      }
    }
  }

  /**
   * ngOnDestroy - Limpieza completa
   */
  ngOnDestroy() {
    if (this.destroyTimeout) {
      clearTimeout(this.destroyTimeout);
      this.destroyTimeout = null;
    }
    
    if (this.splide) {
      this.splide.destroy();
      this.splide = null;
      this.isInitialized = false;
    }
  }

  /**
   * Método público para reiniciar manualmente
   */
  public restart() {
    const root = this.root();
    if (!root) return;
    
    this.reinitializeSplide(
      root.nativeElement,
      this.source().defaults(),
      this.source().options(),
      this.source().autoScroll()
    );
  }
}