import { NgDocPage } from '@ng-doc/core';
import { F24Icon } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24IconDemo } from './demos/f24-icon-demo';

/**
 * F24IconPage
 */
const F24IconPage: NgDocPage = {
	title: `F24Icon`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24IconDemo },
	playgrounds: {
		F24IconPlayground: {
			target: F24Icon,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				icon: { type: 'string' },
				size: { type: 'number' },
			},
			defaults: {
				icon: 'home',
				size: 24,
			},
		},
	},
};

/**
 * F24IconPage
 */
export default F24IconPage;
