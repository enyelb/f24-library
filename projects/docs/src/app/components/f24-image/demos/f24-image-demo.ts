import { Component } from '@angular/core';
import { F24Image } from '@f24/layout';

@Component({
  selector: 'f24-image-demo',
  standalone: true,
  imports: [F24Image],
  template: `
    <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
      <div>
        <span style="font-size: 12px; color: gray; display: block; margin-bottom: 4px;">Imagen con Zoom al Clic:</span>
        <f24-image 
          [src]="'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=60'" 
          [alt]="'Muestra de Arte'" 
          [zoomClick]="true" 
          [zoomSize]="'m'"
        />
      </div>

      <div>
        <span style="font-size: 12px; color: gray; display: block; margin-bottom: 4px;">Con Imagen de Respaldo (Fallback):</span>
        <f24-image 
          [src]="'https://broken-url-example.com/not-found.png'" 
          [default]="'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=60'" 
          [alt]="'Fallback Image'"
        />
      </div>
    </div>
  `,
})
export class F24ImageDemo {}
