import { NgDocPage } from '@ng-doc/core';
import { F24Image } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24ImageDemo } from './demos/f24-image-demo';

/**
 * F24ImagePage
 */
const F24ImagePage: NgDocPage = {
	title: `F24Image`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24ImageDemo },
	playgrounds: {
		F24ImagePlayground: {
			target: F24Image,
			template: `<ng-doc-selector></ng-doc-selector>`,
			controls: {
				src: { type: 'string' },
				alt: { type: 'string' },
				default: { type: 'string' },
				zoomClick: { type: 'boolean' },
			},
			defaults: {
				src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=60',
				alt: 'Muestra de Arte',
				default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=60',
				zoomClick: true,
			},
		},
	},
};

/**
 * F24ImagePage
 */
export default F24ImagePage;
