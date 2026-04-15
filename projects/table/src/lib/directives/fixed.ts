// fixed-thead.directive.ts
import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[f24FixedThead]'
})
export class FixedTheadDirective implements OnInit, OnDestroy {
  @Input() offsetTop = 0; // desplazamiento desde el top (px)

  private originalThead: HTMLElement | null = null;
  private fixedDiv: HTMLElement | null = null;
  private cloneThead: HTMLElement | null = null;
  private cloneTable: HTMLElement | null = null;
  private scrollContainer: HTMLElement | null = null;
  private mutationObserver: MutationObserver | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const table = this.el.nativeElement as HTMLTableElement;
    if (!table || table.tagName !== 'TABLE') {
      console.warn('appFixedThead debe aplicarse a un elemento <table>');
      return;
    }

    this.originalThead = table.querySelector('thead');
    if (!this.originalThead) return;

    // Crear contenedor fijo
    this.fixedDiv = this.renderer.createElement('div');
    this.renderer.addClass(this.fixedDiv, 'fixed-thead-clone');
    this.renderer.setStyle(this.fixedDiv, 'position', 'fixed');
    this.renderer.setStyle(this.fixedDiv, 'top', `${this.offsetTop}px`);
    this.renderer.setStyle(this.fixedDiv, 'left', '0');
    this.renderer.setStyle(this.fixedDiv, 'right', '0');
    this.renderer.setStyle(this.fixedDiv, 'zIndex', '1000');
    this.renderer.setStyle(this.fixedDiv, 'display', 'none');
    this.renderer.setStyle(this.fixedDiv, 'backgroundColor', '#fff');
    this.renderer.setStyle(this.fixedDiv, 'boxShadow', '0 2px 5px rgba(0,0,0,0.1)');

    // Crear tabla clon
    this.cloneTable = this.renderer.createElement('table');
    this.renderer.setStyle(this.cloneTable, 'width', '100%');
    this.renderer.setStyle(this.cloneTable, 'borderCollapse', 'collapse');
    this.cloneThead = this.originalThead.cloneNode(true) as HTMLElement;
    this.renderer.appendChild(this.cloneTable, this.cloneThead);
    this.renderer.appendChild(this.fixedDiv, this.cloneTable);
    this.renderer.appendChild(document.body, this.fixedDiv);

    // Detectar contenedor con scroll (busca el ancestro más cercano con overflow auto/scroll)
    this.scrollContainer = this.findScrollContainer(table);

    // Sincronizar y mostrar/ocultar
    this.syncAndShow = this.syncAndShow.bind(this);

    // Eventos
    if (this.scrollContainer) {
      this.scrollListener = this.renderer.listen(this.scrollContainer, 'scroll', this.syncAndShow);
    }
    this.resizeListener = this.renderer.listen(window, 'resize', this.syncAndShow);

    // Observar cambios en la tabla (columnas dinámicas)
    this.mutationObserver = new MutationObserver(() => this.syncAndShow());
    this.mutationObserver.observe(table, { childList: true, subtree: true, attributes: true });

    // Inicializar
    this.syncAndShow();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) this.scrollListener();
    if (this.resizeListener) this.resizeListener();
    if (this.mutationObserver) this.mutationObserver.disconnect();
    if (this.fixedDiv && this.fixedDiv.parentNode) {
      this.fixedDiv.parentNode.removeChild(this.fixedDiv);
    }
  }

  private syncAndShow(): void {
    if (!this.originalThead || !this.fixedDiv || !this.cloneThead || !this.cloneTable) return;

    const table = this.el.nativeElement as HTMLTableElement;
    const originalCells = this.originalThead.querySelectorAll('th');
    const cloneCells = this.cloneThead.querySelectorAll('th');
    if (originalCells.length !== cloneCells.length) return;

    // Sincronizar anchos
    const tableRect = table.getBoundingClientRect();
    this.renderer.setStyle(this.cloneTable, 'width', `${tableRect.width}px`);
    this.renderer.setStyle(this.fixedDiv, 'left', `${tableRect.left}px`);

    for (let i = 0; i < originalCells.length; i++) {
      const width = (originalCells[i] as HTMLElement).offsetWidth;
      this.renderer.setStyle(originalCells[i], 'width', `${width}px`);
      this.renderer.setStyle(cloneCells[i], 'width', `${width}px`);
    }

    // Mostrar/ocultar según visibilidad de la cabecera original
    const theadRect = this.originalThead.getBoundingClientRect();
    const isOutOfView = theadRect.bottom < this.offsetTop;

    if (isOutOfView) {
      this.renderer.setStyle(this.fixedDiv, 'display', 'block');
      this.renderer.setStyle(this.originalThead, 'visibility', 'hidden');
    } else {
      this.renderer.setStyle(this.fixedDiv, 'display', 'none');
      this.renderer.setStyle(this.originalThead, 'visibility', 'visible');
    }
  }

  private findScrollContainer(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const overflow = style.overflow + style.overflowY;
      if (overflow.includes('auto') || overflow.includes('scroll')) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window as any; // si no hay contenedor con scroll, usamos window
  }
}