'use client';
import { useEffect, useState } from 'react';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { Service } from '@app-launch-kit/modules/user-profile';
import { Box } from '@app-launch-kit/components/primitives/box';
import { ScrollView } from '@app-launch-kit/components/primitives/scroll-view';
import AccountsOptionBar from '@app-launch-kit/modules/user-profile/components/AccountsOptionBar';
import { Heading } from '@app-launch-kit/components/primitives/heading';
import { Image } from '@app-launch-kit/components/primitives/image';
import { Alert, AlertText } from '@app-launch-kit/components/primitives/alert';
import { useAuth } from '@app-launch-kit/modules/auth';

const ProfileLandingPage = () => {
  const { session } = useAuth();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const profileResponse = await Service.fetchUserProfile(
            session.user.id
          );

          // Handle errors from the profile response
          if (profileResponse.error) {
            setError(
              profileResponse.error.message ||
                'An error occurred while fetching profile.'
            );
          } else if (profileResponse.data) {
            // Handle successful profile fetch
            const { data } = profileResponse;
            if (data.cover_image_url) {
              setCoverImage(data.cover_image_url);
            }
          } else {
            // Handle case where no data is returned
            setError('Profile data is not available.');
          }
        } catch (error: any) {
          setError(error.message || 'An unexpected error occurred.'); // Set unexpected error message
        }
      } else {
        setError('User ID is missing in the session.');
      }
    };

    fetchData();
  }, [session?.user?.id]);

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="flex-1 bg-background-0">
          <Heading className="hidden md:flex text-3xl text-typography-900 font-bold px-10 pt-5 lg:pt-7 pb-6">
            Profile
          </Heading>
          <Box className="h-[200px] w-full">
            <Image
              source={
                coverImage
                  ? { uri: coverImage }
                  : require('@app-launch-kit/modules/user-profile/assets/images/coverImage.png')
              }
              className="w-full h-full"
              alt="cover image"
              contentFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
          {error && (
            <Alert action="error">
              <AlertText>{error}</AlertText>
            </Alert>
          )}
          <AccountsOptionBar />
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ProfileLandingPage;
