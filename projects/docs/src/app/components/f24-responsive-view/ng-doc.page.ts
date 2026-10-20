import { NgDocPage } from '@ng-doc/core';
import { F24ResponsiveView } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24ResponsiveViewDemo } from './demos/f24-responsive-view-demo';

/**
 * F24ResponsiveViewPage
 */
const F24ResponsiveViewPage: NgDocPage = {
	title: `F24ResponsiveView`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24ResponsiveViewDemo },
	playgrounds: {
		F24ResponsiveViewPlayground: {
			target: F24ResponsiveView,
			template: `<ng-doc-selector></ng-doc-selector>`,
		},
	},
};

/**
 * F24ResponsiveViewPage
 */
export default F24ResponsiveViewPage;
