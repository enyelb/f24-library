import { NgDocConfiguration } from '@ng-doc/builder';
import { ngKeywordsLoader, rxjsKeywordsLoader } from '@ng-doc/keywords-loaders';

const config: NgDocConfiguration = {
  outDir: 'projects/docs',
  tsConfig: 'projects/docs/tsconfig.app.json',
  cache: false,
  keywords: {
    loaders: [ngKeywordsLoader(), rxjsKeywordsLoader()],
  },
  repoConfig: {
    url: 'https://github.com/enyelb/f24-library',
    mainBranch: 'main',
    releaseBranch: 'main'
  },
  /*shiki: {
    themes: {
      dark: 'material-theme-darker',
      light: 'material-theme-lighter',
    },
  },*/
};

export default config;