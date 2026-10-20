import { NgDocPage } from '@ng-doc/core';
import { F24Divider } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24DividerDemo } from './demos/f24-divider-demo';

/**
 * F24DividerPage
 */
const F24DividerPage: NgDocPage = {
	title: `F24Divider`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24DividerDemo },
	playgrounds: {
		F24DividerPlayground: {
			target: F24Divider,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				title: { type: 'string' },
				icon: { type: 'string' },
			},
			defaults: {
				title: 'O continúa con',
				icon: 'security',
			},
		},
	},
};

/**
 * F24DividerPage
 */
export default F24DividerPage;
