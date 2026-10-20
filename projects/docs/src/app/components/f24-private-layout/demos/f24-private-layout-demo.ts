import { Component } from '@angular/core';
import { F24PrivateLayout, createPrivateLayoutSource, F24SidenavRouteSourceParams } from '@f24/layout';

@Component({
  selector: 'f24-private-layout-demo',
  standalone: true,
  imports: [F24PrivateLayout],
  template: `
    <f24-private-layout 
      [name]="'Mi Aplicación'"
      [routes]="routes"
      [compact]="false"
      [top]="false"
      [position]="'start'"
    />
  `,
  styles: [`
    html {
      --f24-private-layout-background: #f0f0f0;
    }  
  `]
})
export class F24PrivateLayoutDemo {
  readonly routes: F24SidenavRouteSourceParams[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      url: '/dashboard',
    },
    {
      title: 'Administración',
      icon: 'settings',
      children: [
        {
          title: 'Usuarios',
          icon: 'people',
          url: '/admin/users',
        },
        {
          title: 'Roles',
          icon: 'security',
          url: '/admin/roles',
        },
      ],
    },
    {
      title: 'Reportes',
      icon: 'analytics',
      url: '/reports',
    },
  ];
}
