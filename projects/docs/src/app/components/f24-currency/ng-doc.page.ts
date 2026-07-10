import { NgDocPage } from '@ng-doc/core';

import { F24Currency } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';

import { F24CurrencyDemo } from './demos/f24-currency-demo';

/**
 * F24CurrencyPage
 */
const F24CurrencyPage: NgDocPage = {
	title: `F24Currency`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24CurrencyDemo },
	playgrounds: { 
		F24CurrencyPlayground: {
			target: F24Currency,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				label: { type: 'number' },
				ves: { type: 'number' },
				usd: { type: 'number' },
			},
			defaults: {
				label: 'Monto Total', 
  			ves: 150.50, 
  			usd: 3.50
			}
		} 
	},
};
/**
 * F24CurrencyPage
 */
export default F24CurrencyPage;
