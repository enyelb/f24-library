import { NgDocPage } from '@ng-doc/core';
import { F24Container } from '@f24/layout';

import ComponentsCategory from '../ng-doc.category';
import { F24ContainerDemo } from './demos/f24-container-demo';

/**
 * F24ContainerPage
 */
const F24ContainerPage: NgDocPage = {
	title: `F24Container`,
	mdFile: './index.md',
	category: ComponentsCategory,
	demos: { F24ContainerDemo },
	playgrounds: {
		F24ContainerPlayground: {
			target: F24Container,
			template: `<ng-doc-selector><div style="padding: 1rem;">Contenido proyectado dentro del contenedor</div></ng-doc-selector>`,
		},
	},
};

/**
 * F24ContainerPage
 */
export default F24ContainerPage;
