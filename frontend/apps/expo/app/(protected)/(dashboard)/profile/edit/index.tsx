import React from 'react';
import EditProfileForm from '@app-launch-kit/modules/user-profile/components/EditProfileForm';
import { Box } from '@app-launch-kit/components/primitives/box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';
import { Heading } from '@app-launch-kit/components/primitives/heading';
import { useAuth } from '@app-launch-kit/modules/auth';

const Profile = () => {
  const { session } = useAuth();

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={Platform.OS === 'ios'}
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="grow lg:pb-3 md:px-10 bg-background-0"
      extraScrollHeight={100}
      extraHeight={100}
    >
      <Heading className="hidden md:flex text-3xl text-typography-900 font-bold pt-5 lg:pt-7">
        Edit Profile
      </Heading>
      <Box
        className="w-full md:shadow-hard-5 md:border md:border-outline-50 pb-5 md:max-w-[700px] md:rounded-3xl md:mt-8 self-center items-center" // Adjusted styling
      >
        <EditProfileForm userId={session?.user?.id!} />
      </Box>
    </KeyboardAwareScrollView>
  );
};

export default Profile;
