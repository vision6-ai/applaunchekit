import React from 'react';
import { Slot } from 'expo-router';
import { Box } from '@app-launch-kit/components/primitives/box';

const Layout = () => {
  return (
    <Box className="flex-1 bg-background-0">
      <Slot />
    </Box>
  );
};

export default Layout;
