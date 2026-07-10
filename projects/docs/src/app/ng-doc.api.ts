import {NgDocApi} from '@ng-doc/core';

const Api: NgDocApi = {
	title: 'API References',
  keyword: 'ApiReferences',
	scopes: [
		{
      name: '@f24/alerts',
      route: 'components',
      include: 'projects/alerts/src/public-api.ts',
    },
		{
      name: '@f24/api',
      route: 'components',
      include: 'projects/api/src/public-api.ts',
    },
		{
      name: '@f24/buttons',
      route: 'components',
      include: 'projects/buttons/src/public-api.ts',
    },
		{
      name: '@f24/core',
      route: 'components',
      include: 'projects/core/src/public-api.ts',
    },
		{
      name: '@f24/data',
      route: 'components',
      include: 'projects/data/src/public-api.ts',
    },
		{
      name: '@f24/filters',
      route: 'components',
      include: 'projects/filters/src/public-api.ts',
    },
		{
      name: '@f24/forms',
      route: 'components',
      include: 'projects/forms/src/public-api.ts',
    },
		{
      name: '@f24/functions',
      route: 'components',
      include: 'projects/functions/src/public-api.ts',
    },
		{
      name: '@f24/layout',
      route: 'components',
      include: 'projects/layout/src/public-api.ts',
    },
		{
      name: '@f24/list',
      route: 'components',
      include: 'projects/list/src/public-api.ts',
    },
		{
      name: '@f24/notifications',
      route: 'components',
      include: 'projects/layout/notifications/public-api.ts',
    },
		{
      name: '@f24/preview',
      route: 'components',
      include: 'projects/layout/preview/public-api.ts',
    },
		{
      name: '@f24/splide',
      route: 'components',
      include: 'projects/splide/src/public-api.ts',
    },
		{
      name: '@f24/table',
      route: 'components',
      include: 'projects/table/src/public-api.ts',
    },
		{
      name: '@f24/timeline',
      route: 'components',
      include: 'projects/timeline/src/public-api.ts',
    },
	],
};

export default Api;
