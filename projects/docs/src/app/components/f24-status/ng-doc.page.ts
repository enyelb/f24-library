import { NgDocPage } from '@ng-doc/core';
import { F24Status } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24StatusDemo } from './demos/f24-status-demo';

/**
 * F24StatusPage
 */
const F24StatusPage: NgDocPage = {
	title: `F24Status`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24StatusDemo },
	playgrounds: {
		F24StatusPlayground: {
			target: F24Status,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				status: { type: 'string' },
				color: { type: 'string' },
				background: { type: 'string' },
				tooltip: { type: 'string' },
			},
			defaults: {
				status: 'Activo',
				color: '#15803d',
				background: '#dcfce7',
				tooltip: 'Estado actual',
			},
		},
	},
};

/**
 * F24StatusPage
 */
export default F24StatusPage;
