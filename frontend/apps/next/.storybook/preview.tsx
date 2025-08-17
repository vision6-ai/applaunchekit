import React, { useEffect, useState } from 'react';
import type { Preview } from '@storybook/react';
import { GluestackUIProvider } from '@app-launch-kit/components/primitives/gluestack-ui-provider';
import '../app/globals.css';

// Example decorator function
const withGlobalStyles = (Story, context) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const currentTheme = context.globals.theme;

    const isDarkMode = currentTheme === 'dark';
    setMode(isDarkMode ? 'dark' : 'light');
  }, [context.globals.theme]);

  return (
    <GluestackUIProvider mode={mode}>
      <Story />
    </GluestackUIProvider>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        items: [
          {
            value: 'light',
            title: 'Light',
            icon: 'circlehollow',
          },
          {
            value: 'dark',
            title: 'Dark',
            icon: 'circle',
          },
        ],
        showName: true,
      },
    },
  },
  decorators: [withGlobalStyles],
};

export default preview;
