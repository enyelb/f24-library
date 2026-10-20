import { NgDocPage } from '@ng-doc/core';
import { F24Quantity } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24QuantityDemo } from './demos/f24-quantity-demo';

/**
 * F24QuantityPage
 */
const F24QuantityPage: NgDocPage = {
	title: `F24Quantity`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24QuantityDemo },
	playgrounds: {
		F24QuantityPlayground: {
			target: F24Quantity,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				label: { type: 'string' },
				quantity: { type: 'number' },
				icon: { type: 'string' },
				tooltip: { type: 'string' },
			},
			defaults: {
				label: 'Stock Disponible:',
				quantity: 1420,
				icon: 'inventory_2',
				tooltip: 'Unidades en almacén central',
			},
		},
	},
};

/**
 * F24QuantityPage
 */
export default F24QuantityPage;
