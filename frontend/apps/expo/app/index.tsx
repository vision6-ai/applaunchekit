import Header from '@app-launch-kit/modules/landing-page/components/Header';
import LandingPageHero from '@app-launch-kit/modules/landing-page/components/Hero';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { ScrollView } from '@app-launch-kit/components/primitives/scroll-view';
import React from 'react';

const Home = () => {
  return (
    <VStack className="flex-1 bg-background-0">
      <Header />
      <ScrollView>
        {/* rtl support + language support */}
        {/* <Box className="flex-1 items-start">
          <Text>{getTranslation('welcome')}</Text>
        </Box> */}
        <LandingPageHero />
      </ScrollView>
    </VStack>
  );
};

export default Home;
