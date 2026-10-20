import { NgDocPage } from '@ng-doc/core';
import { F24PrivateLayout } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24PrivateLayoutDemo } from './demos/f24-private-layout-demo';

/**
 * F24PrivateLayoutPage
 */
const F24PrivateLayoutPage: NgDocPage = {
	title: `F24PrivateLayout`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24PrivateLayoutDemo },
	playgrounds: {
		F24PrivateLayoutPlayground: {
			target: F24PrivateLayout,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				name: { type: 'string' },
				compact: { type: 'boolean' },
				top: { type: 'boolean' },
				icon: { type: 'string' },
				position: {
					type: 'string',
					options: ['start', 'end'],
				},
			},
			defaults: {
				name: 'Mi Aplicación',
				compact: false,
				top: false,
				icon: 'menu',
				position: 'start',
        routes: [
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
        ],
			},
		},
	},
};

/**
 * F24PrivateLayoutPage
 */
export default F24PrivateLayoutPage;
