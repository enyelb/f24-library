import { NgDocPage } from '@ng-doc/core';
import { F24Lazy } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24LazyDemo } from './demos/f24-lazy-demo';

/**
 * F24LazyPage
 */
const F24LazyPage: NgDocPage = {
	title: `F24Lazy`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24LazyDemo },
	playgrounds: {
		F24LazyPlayground: {
			target: F24Lazy,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				disableLoading: { type: 'boolean' },
			},
			defaults: {
				disableLoading: false,
			},
		},
	},
};

/**
 * F24LazyPage
 */
export default F24LazyPage;
