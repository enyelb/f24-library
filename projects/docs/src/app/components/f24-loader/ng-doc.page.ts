import { NgDocPage } from '@ng-doc/core';
import { F24Loader } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24LoaderDemo } from './demos/f24-loader-demo';

/**
 * F24LoaderPage
 */
const F24LoaderPage: NgDocPage = {
	title: `F24Loader`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24LoaderDemo },
	playgrounds: {
		F24LoaderPlayground: {
			target: F24Loader,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				isLoading: { type: 'boolean' },
				icon: { type: 'string' },
			},
			defaults: {
				isLoading: true,
				icon: 'sync',
			},
		},
	},
};

/**
 * F24LoaderPage
 */
export default F24LoaderPage;
