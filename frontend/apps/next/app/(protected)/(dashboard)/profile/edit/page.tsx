'use client';
import EditProfileForm from '@app-launch-kit/modules/user-profile/components/EditProfileForm';
import { ScrollView } from '@app-launch-kit/components/primitives/scroll-view';
import { Box } from '@app-launch-kit/components/primitives/box';
import { Heading } from '@app-launch-kit/components/primitives/heading';
import { useAuth } from '@app-launch-kit/modules/auth';

const Profile = () => {
  const { session } = useAuth();

  return (
    <ScrollView contentContainerClassName="grow lg:pb-3 md:px-10">
      <Heading className="hidden md:flex text-3xl text-typography-900 font-bold pt-5 lg:pt-7">
        Edit Profile
      </Heading>
      <Box
        className="w-full md:shadow-hard-5 md:border md:border-outline-50 pb-5 md:max-w-[700px] md:rounded-3xl md:mt-8 self-center items-center" // Adjusted styling
      >
        <EditProfileForm userId={session?.user?.id!} />
      </Box>
    </ScrollView>
  );
};

export default Profile;
