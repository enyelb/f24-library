import { Component } from '@angular/core';
import { F24Sidenav, F24SidenavRouteSourceParams } from '@f24/layout';

@Component({
  selector: 'f24-sidenav-demo',
  standalone: true,
  imports: [F24Sidenav],
  template: `
    <div style="--f24-sidenav-background: #0f172a; --f24-sidenav-color: #f8fafc; --f24-sidenav-children-background: #1e293b; width: 260px; height: 380px; border-radius: 8px; overflow: hidden;">
      <f24-sidenav 
        [name]="'Panel de Control'"
        [routes]="routes" 
        [compact]="false" 
        [allowExpandedMultiple]="false" 
      />
    </div>
  `,
})
export class F24SidenavDemo {
  readonly routes: F24SidenavRouteSourceParams[] = [
    { title: 'Inicio', icon: 'dashboard', url: '/dashboard' },
    {
      title: 'Inventario',
      icon: 'inventory_2',
      children: [
        { title: 'Productos', icon: 'category', url: '/products' },
        { title: 'Movimientos', icon: 'sync_alt', url: '/movements' },
      ],
    },
    { title: 'Configuración', icon: 'settings', url: '/settings' },
  ];
}
