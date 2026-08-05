import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
/**
 * F24IconType
 */
export type F24IconType = {
  type: 'svg' | 'gif'
  path: string,
  url: SafeResourceUrl
}
/**
 * F24IconService
 */
@Injectable({
  providedIn: 'root'
})
export class F24IconService {
  /**
   * Services
   */
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);
  /**
   * customIcons
   */
  private customIcons = new Map<string, F24IconType>();
  /**
   * register
   * @param name 
   * @param path 
   * @returns
   */
  public register(name: string, path: string) {
    /**
     * si exite ya un icono con ese nombre ignorar
     */
    if (this.customIcons.has(name)) {
      return;
    }
    /**
     * obtener el tipo de extension y guardarlo en el map
     */
    const type = path.endsWith('.gif') ? 'gif' : 'svg';
    const url = this.domSanitizer.bypassSecurityTrustResourceUrl(path);
    this.customIcons.set(name, { type, path, url });
    /**
     * si es un svg registrarlo en mat icon para que lo soporte nativo
     */
    if (type === 'svg') {
      this.matIconRegistry.addSvgIcon(name, url);
    }
  }
  /**
   * funcion para validar de que tipo es el icono
   * @param name 
   * @returns 
   */
  isType(name: string) : 'material' | F24IconType['type'] {
    const icon = this.customIcons.get(name);
    if (icon) {
      return icon.type;
    }
    return 'material';
  }
  /**
   * funcion para validar de que tipo es el icono
   * @param name 
   * @returns 
   */
  icon(name: string) : F24IconType | undefined {
    return this.customIcons.get(name);
  }
}
