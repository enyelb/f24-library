import { NgDocPage } from '@ng-doc/core';
import { F24Sidenav } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24SidenavDemo } from './demos/f24-sidenav-demo';

/**
 * F24SidenavPage
 */
const F24SidenavPage: NgDocPage = {
	title: `F24Sidenav`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24SidenavDemo },
	playgrounds: {
		F24SidenavPlayground: {
			target: F24Sidenav,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				name: { type: 'string' },
				compact: { type: 'boolean' },
				allowExpandedMultiple: { type: 'boolean' },
			},
			defaults: {
				name: 'Panel de Control',
				compact: false,
				allowExpandedMultiple: false,
			},
		},
	},
};

/**
 * F24SidenavPage
 */
export default F24SidenavPage;
