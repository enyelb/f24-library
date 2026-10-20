import { NgDocPage } from '@ng-doc/core';
import { F24Description } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24DescriptionDemo } from './demos/f24-description-demo';

/**
 * F24DescriptionPage
 */
const F24DescriptionPage: NgDocPage = {
	title: `F24Description`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24DescriptionDemo },
	playgrounds: {
		F24DescriptionPlayground: {
			target: F24Description,
			template: `<ng-doc-selector><button mat-button right>Acción</button></ng-doc-selector>`,
			controls: {
				title: { type: 'string' },
				subtitle: { type: 'string' },
			},
			defaults: {
				title: 'Factura #FAC-2026-0042',
				subtitle: 'Emitida el 05 de Septiembre, 2026',
			},
		},
	},
};

/**
 * F24DescriptionPage
 */
export default F24DescriptionPage;
