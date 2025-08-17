import { accountData } from '@app-launch-kit/modules/dashboard/constants/dashboard';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { Pressable } from '@app-launch-kit/components/primitives/pressable';
import { HStack } from '@app-launch-kit/components/primitives/hstack';
import { EditIcon, Icon } from '@app-launch-kit/components/primitives/icon';
import { Text } from '@app-launch-kit/components/primitives/text';
import { useRouter } from '@unitools/router';
import {
  Avatar,
  AvatarImage,
} from '@app-launch-kit/components/primitives/avatar';
import { useEffect, useState } from 'react';
import { Box } from '@app-launch-kit/components/primitives/box';
import {
  Button,
  ButtonIcon,
  ButtonText,
} from '@app-launch-kit/components/primitives/button';
import config from '@app-launch-kit/config';
import { Service as UserProfileService } from '@app-launch-kit/modules/user-profile';
import { useAuth } from '@app-launch-kit/modules/auth';

const AccountsOptionBar = () => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const { session } = useAuth();
  const handlePress = (routeName: string) => {
    router.push(routeName);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) {
        console.error('User ID is missing.');
        return;
      }

      try {
        const { data: profileResponse, error } =
          await UserProfileService.fetchUserProfile(session.user.id);

        if (error) {
          console.error(
            'Failed to fetch user profile:',
            error.message || 'An error occurred.'
          );
          return;
        }

        const profile = profileResponse;

        if (profile) {
          if (profile.first_name || profile.last_name) {
            setUserName(
              `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            );
          } else {
            setUserName(''); // Clear the user name if not available
          }

          setEmail(session.user.email || '');

          if (profile.profile_image_url) {
            setProfileImageUrl(profile?.profile_image_url);
          } else {
            setProfileImageUrl(null); // Clear profile image if not available
          }
        } else {
          console.warn('Profile data is empty.');
        }
      } catch (error: any) {
        console.error(
          'Error in fetchData:',
          error.message || 'An unexpected error occurred.'
        );
      }
    };

    fetchData();
  }, [session?.user]);

  return (
    <VStack className="flex-1 border-outline-100 w-full rounded-xl p-4 gap-4 md:w-[750px] md:self-center">
      <VStack className="px-4 rounded-xl  justify-between items-center ">
        <Avatar size="2xl" className="-mt-[64px] justify-center">
          <AvatarImage
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require('@app-launch-kit/assets/images/user-profile.svg')
            }
            className="w-full h-full"
            width="100%"
            height="100%"
            alt="avatar image"
            contentFit="cover"
          />
        </Avatar>

        <VStack className="justify-center items-center py-4">
          <Text>{userName}</Text>
          <Text>{email}</Text>
        </VStack>
      </VStack>
      <Button
        className="self-end gap-2"
        onPress={() => router.push(config.routes.editProfile.path)}
      >
        <ButtonText>Edit Profile</ButtonText>
        <ButtonIcon as={EditIcon} />
      </Button>
      <VStack className="w-full border border-outline-100 rounded-xl overflow-hidden">
        {accountData.map((item, index) => {
          return (
            <Box
              key={index}
              className={`w-full border-outline-100
              ${accountData.length - 1 !== index ? 'border-b' : ''} 
              data-[disabled=true]:hover:border-transparent`}
            >
              <Pressable
                className="w-full rounded-lg rounded-b-none data-[disabled=false]:hover:bg-background-50 cursor-pointer data-[disabled=true]:cursor-not-allowed"
                onPress={() => handlePress(item.route)}
                disabled={item.disabled}
              >
                <HStack
                  space="2xl"
                  className="justify-between items-center w-full p-6"
                >
                  <HStack className=" justify-start items-center" space="md">
                    <Icon
                      as={item.iconName}
                      className="stroke-background-500"
                    />
                    <Text size="lg" className="text-typography-900">
                      {item.subText}
                    </Text>
                  </HStack>
                  <Icon as={item.endIcon} className="stroke-background-500" />
                </HStack>
              </Pressable>
            </Box>
          );
        })}
      </VStack>
    </VStack>
  );
};

export default AccountsOptionBar;
