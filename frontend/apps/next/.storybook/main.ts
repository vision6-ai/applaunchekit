import type { StorybookConfig } from '@storybook/nextjs';

import path, { join, dirname, resolve } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-react-native-web'),
    getAbsolutePath('@gluestack/storybook-addon'),
    '@storybook/addon-styling-webpack',
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {
      nextConfigPath: resolve(__dirname, '../next.config.mjs'),
    },
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  webpackFinal: async (config: any) => {
    config.resolve.alias['@unitools/image'] = '@unitools/image-next';
    config.resolve.alias['@unitools/link'] = '@unitools/link-next';
    config.resolve.alias['@unitools/router'] = '@unitools/router-next';
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
      include: [
        resolve(__dirname, './node_modules/react-native-css-interop'),
        resolve(__dirname, '../node_modules/react-native-css-interop'),
      ],
    });

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
          'nativewind/babel',
        ],
        plugins: ['react-native-reanimated/plugin'],
      },

      include: [
        resolve(__dirname, '../../../packages/components'),
        resolve(__dirname, '../stories'),
      ],
    });

    return config;
  },
};
export default config;
