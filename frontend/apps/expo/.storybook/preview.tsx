import '../globals.css';
import type { Preview } from '@storybook/react';
import { GluestackUIProvider } from '@app-launch-kit/components/primitives/gluestack-ui-provider';
import React, { useEffect, useState } from 'react';
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

// Example decorator function
const withGlobalStyles = (Story, context) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [fontsLoaded, error] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      const currentTheme = context.globals.theme;
      const isDarkMode = currentTheme === 'dark';
      setMode(isDarkMode ? 'dark' : 'light');
    }
  }, [context.globals.theme, fontsLoaded]);

  if (!fontsLoaded) {
    console.log('fonts not loaded');
    return <></>;
  }

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
          { value: 'light', title: 'Light', icon: 'circlehollow' },
          { value: 'dark', title: 'Dark', icon: 'circle' },
        ],
        showName: true,
      },
    },
  },
  decorators: [withGlobalStyles],
};

export default preview;
