import { NgDocPage } from '@ng-doc/core';
import { F24Navbar } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24NavbarDemo } from './demos/f24-navbar-demo';

/**
 * F24NavbarPage
 */
const F24NavbarPage: NgDocPage = {
	title: `F24Navbar`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24NavbarDemo },
	playgrounds: {
		F24NavbarPlayground: {
			target: F24Navbar,
			template: `<ng-doc-selector><div options><button mat-button>Acción</button></div></ng-doc-selector>`,
			controls: {
				name: { type: 'string' },
				icon: { type: 'string' },
			},
			defaults: {
				name: 'Portal Corporativo',
				icon: 'menu',
			},
		},
	},
};

/**
 * F24NavbarPage
 */
export default F24NavbarPage;
