import { NgDocPage } from '@ng-doc/core';

import { F24Copy } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';

import { F24CopyDemo } from './demos/f24-copy-demo';

/**
 * F24CopyPage
 */
const F24CopyPage: NgDocPage = {
	title: `F24Copy`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24CopyDemo },
	playgrounds: { 
		F24CopyPlayground: {
			target: F24Copy,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				copy: { type: 'string' },
				text: { type: 'string' },
			},
			defaults: {
				text: 'Show text',
				copy: 'Copy text'
			}
		} 
	},
};
/**
 * F24CopyPage
 */
export default F24CopyPage;
