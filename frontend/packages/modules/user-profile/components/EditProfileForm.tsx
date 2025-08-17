'use client';
import { showToast } from '@app-launch-kit/components/common/Toast';
import {
  Avatar,
  AvatarImage,
  AvatarBadge,
} from '@app-launch-kit/components/primitives/avatar';
import {
  Button,
  ButtonText,
  ButtonSpinner,
} from '@app-launch-kit/components/primitives/button';
import { useRouter } from '@unitools/router';
import { Box } from '@app-launch-kit/components/primitives/box';
import { Center } from '@app-launch-kit/components/primitives/center';
import { Fab, FabIcon } from '@app-launch-kit/components/primitives/fab';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@app-launch-kit/components/primitives/form-control';

import {
  Icon,
  ChevronDownIcon,
  EditIcon,
  InfoIcon,
} from '@app-launch-kit/components/primitives/icon';
import { Image } from '@app-launch-kit/components/primitives/image';
import { Input, InputField } from '@app-launch-kit/components/primitives/input';
import { Pressable } from '@app-launch-kit/components/primitives/pressable';
import {
  Select,
  SelectBackdrop,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectContent,
  SelectItem,
  SelectIcon,
} from '@app-launch-kit/components/primitives/select';
import { useToast } from '@app-launch-kit/components/primitives/toast';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { pickImage } from '@app-launch-kit/utils/utils';
import { city } from '@app-launch-kit/utils/validators/city';
import { country } from '@app-launch-kit/utils/validators/country';
import { firstName } from '@app-launch-kit/utils/validators/firstName';
import { gender } from '@app-launch-kit/utils/validators/gender';
import { lastName } from '@app-launch-kit/utils/validators/lastName';
import { phoneNumber } from '@app-launch-kit/utils/validators/phoneNumber';
import { state } from '@app-launch-kit/utils/validators/state';
import { zipCode } from '@app-launch-kit/utils/validators/zipCode';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Pencil } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { z } from 'zod';
import colors from 'tailwindcss/colors';
import { Text } from '@app-launch-kit/components/primitives/text';
import { HStack } from '@app-launch-kit/components/primitives/hstack';
import { Skeleton } from '@app-launch-kit/components/primitives/skeleton';
import SkeletonEditProfile from '@app-launch-kit/modules/user-profile/components/SkeletonEditProfile';
import { Service as FileUploadService } from '@app-launch-kit/modules/file-upload';
import { Service as UserProfileService } from '@app-launch-kit/modules/user-profile';

export const accountDetailsSchema = z.object({
  firstName,
  lastName,
  gender,
  city,
  state,
  country,
  phoneNumber,
  zipCode,
});
export type AccountDetailsSchemaType = z.infer<typeof accountDetailsSchema>;

function EditProfileForm({ userId }: { userId: string | undefined }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
  } = useForm<AccountDetailsSchemaType>({
    resolver: zodResolver(accountDetailsSchema),
  });

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      setIsProfileLoading(true);

      try {
        if (!userId) {
          console.error('User ID is missing.');
          return;
        }

        const { data: profileResponse, error } =
          await UserProfileService.fetchUserProfile(userId);

        if (error) {
          console.error(
            'Failed to fetch user profile:',
            error.message || 'An error occurred.'
          );
          return;
        }

        const profile = profileResponse;

        if (profile) {
          if (profile.profile_image_url) {
            setProfileImage(profile.profile_image_url);
          } else {
            setProfileImage(null); // Clear profile image if not available
          }

          if (profile.cover_image_url) {
            setCoverImage(profile.cover_image_url);
          } else {
            setCoverImage(null); // Clear cover image if not available
          }

          // Set form values if available
          setValue('firstName', profile.first_name || '');
          setValue('lastName', profile.last_name || '');
          setValue('phoneNumber', String(profile.phone_number || ''));
          setValue('gender', profile.gender || '');
          setValue('city', profile.city || '');
          setValue('state', profile.state || '');
          setValue('country', profile.country || '');
          setValue('zipCode', profile.zipcode || '');
        } else {
          console.warn('Profile data is empty.');
        }
      } catch (error: any) {
        console.error(
          'Error fetching user profile:',
          error.message || 'An unexpected error occurred.'
        );
      } finally {
        // Delay setting loading state to avoid flashing
        setTimeout(() => {
          setIsProfileLoading(false);
        }, 500);
      }
    };

    fetchAndSetProfile();
  }, [userId, setValue]);

  const onSubmit = async (_data: AccountDetailsSchemaType) => {
    setLoading(true);

    try {
      let coverImagePath: string | null = coverImage;
      if (coverImage && coverImage.startsWith('data:image')) {
        const result = await FileUploadService.uploadMedia(
          coverImage,
          'cover_images'
        );
        // Check if the result has an error
        if (result.error) {
          throw new Error(
            result.error.message || 'Failed to upload cover image.'
          );
        }
        coverImagePath = result.data?.fullPath ?? '';
      }

      let profileImagePath: string | null = profileImage;
      if (profileImage && profileImage.startsWith('data:image')) {
        const result = await FileUploadService.uploadMedia(
          profileImage,
          'profile_images'
        );
        // Check if the result has an error
        if (result.error) {
          throw new Error(
            result.error.message || 'Failed to upload profile image.'
          );
        }
        profileImagePath = result.data?.fullPath ?? '';
      }

      const { error } = await UserProfileService.updateUserProfile(userId, {
        first_name: _data.firstName,
        last_name: _data.lastName,
        gender: _data.gender,
        city: _data.city,
        state: _data.state,
        country: _data.country,
        zipcode: _data.zipCode,
        phone_number: _data.phoneNumber,
        cover_image_url: coverImagePath,
        profile_image_url: profileImagePath,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update profile.');
      }

      showToast(toast, {
        action: 'success',
        message: 'Profile updated successfully',
      });
      router.replace('/profile');
    } catch (error: any) {
      showToast(toast, {
        action: 'error',
        message: error.message || 'An error occurred. Please try again.',
      });
      console.error('Update profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const { error, data } = await UserProfileService.fetchUserProfile(
        userId ?? ''
      );

      if (error) {
        throw new Error(error.message || 'Failed to fetch user profile.');
      }

      if (data) {
        setUserName(data.first_name || '');
        setProfileImage(data.profile_image_url || '');
        setCoverImage(data.cover_image_url || '');

        setValue('firstName', data.first_name || '');
        setValue('lastName', data.last_name || '');
        setValue('gender', data.gender || '');
        setValue('phoneNumber', data.phone_number || '');
        setValue('city', data.city || '');
        setValue('state', data.state || '');
        setValue('country', data.country || '');
        setValue('zipCode', data.zipcode || '');

        router.replace('/profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className="self-center w-full md:rounded-lg flex-1 bg-background-0">
      <Box className="absolute w-full h-44 md:rounded-t-3xl overflow-hidden">
        <Skeleton isLoaded={!isProfileLoading} className="rounded-none">
          <Image
            source={
              coverImage
                ? { uri: coverImage }
                : require('@app-launch-kit/modules/user-profile/assets/images/coverImage.png')
            }
            alt="cover img"
            className="w-full h-full object-cover"
            height="100%"
            width="100%"
          />
        </Skeleton>
      </Box>
      <Fab
        size="sm"
        placement="top right"
        className="z-[999] bg-background-950 mt-28"
        onPress={() => {
          pickImage(setCoverImage);
        }}
      >
        <FabIcon as={Pencil} className="stroke-background-50" />
      </Fab>
      <Center className="w-full mt-[100px]">
        <Pressable
          onPress={() => {
            pickImage(setProfileImage);
          }}
        >
          <Avatar size="2xl">
            <Skeleton isLoaded={!isProfileLoading} className="rounded-full">
              <AvatarImage
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('@app-launch-kit/assets/images/user-profile.svg')
                }
                alt="avatar img"
                width="100%"
                height="100%"
                contentFit="cover"
              />
              <AvatarBadge className="justify-center items-center bg-background-950">
                <Icon
                  as={EditIcon}
                  className="stroke-background-50"
                  size="sm"
                />
              </AvatarBadge>
            </Skeleton>
          </Avatar>
        </Pressable>
      </Center>
      <VStack className="h-full px-4 pt-8 md:px-5" space="lg">
        {isProfileLoading ? (
          <SkeletonEditProfile isLoaded={!isProfileLoading} />
        ) : (
          <>
            <VStack className="md:flex-row" space="lg">
              <FormControl
                className="flex-1"
                isRequired
                isInvalid={!!errors.firstName}
              >
                <FormControlLabel>
                  <FormControlLabelText>First Name</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="firstName"
                  defaultValue=""
                  control={control}
                  rules={{
                    validate: async (value) => {
                      try {
                        await accountDetailsSchema.parseAsync({
                          name: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Johnathan"
                        type="text"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.firstName?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl className="flex-1" isInvalid={!!errors?.lastName}>
                <FormControlLabel>
                  <FormControlLabelText>Last Name</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="lastName"
                  defaultValue=""
                  control={control}
                  rules={{
                    validate: async (value) => {
                      try {
                        await accountDetailsSchema.parseAsync({
                          name: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Doe"
                        type="text"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.lastName?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
            <VStack className="md:flex-row" space="lg">
              <FormControl
                className="flex-1"
                isInvalid={!!errors.gender}
                isRequired
              >
                <FormControlLabel>
                  <FormControlLabelText>Gender</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Select selectedValue={value} onValueChange={onChange}>
                      <SelectTrigger className="justify-between">
                        <SelectInput placeholder="Select Gender" />
                        <SelectIcon
                          as={ChevronDownIcon}
                          className="mr-3 stroke-background-500"
                        />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectItem label="Male" value="Male" />
                          <SelectItem label="Female" value="Female" />
                          <SelectItem label="Others" value="Others" />
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.gender?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                className="flex-1"
                isInvalid={!!errors.phoneNumber}
                isRequired
              >
                <FormControlLabel>
                  <FormControlLabelText>Phone number</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: async (value) => {
                      try {
                        await accountDetailsSchema.parseAsync({
                          phoneNumber: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Phone number"
                        type="text"
                        keyboardType="phone-pad"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.phoneNumber?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>

            <VStack className="md:flex-row" space="lg">
              <FormControl className="flex-1" isInvalid={!!errors.country}>
                <FormControlLabel>
                  <FormControlLabelText>Country</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="country"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Country"
                        type="text"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.country?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl className="flex-1" isInvalid={!!errors?.state}>
                <FormControlLabel>
                  <FormControlLabelText>State</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="state"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="State"
                        type="text"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.state?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
            <VStack className="md:flex-row" space="lg">
              <FormControl className="flex-1">
                <FormControlLabel>
                  <FormControlLabelText>City</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="City"
                        type="text"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.city?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl className="flex-1" isInvalid={!!errors.zipCode}>
                <FormControlLabel>
                  <FormControlLabelText>Zip Code</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  name="zipCode"
                  defaultValue=""
                  control={control}
                  rules={{
                    validate: async (value) => {
                      try {
                        await accountDetailsSchema.parseAsync({
                          name: value,
                        });
                        return true;
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onBlur, onChange, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Enter zip code"
                        keyboardType="number-pad"
                        value={String(value)}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleKeyPress}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorIcon as={AlertTriangle} />
                  <FormControlErrorText>
                    {errors?.zipCode?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          </>
        )}
        <HStack className="gap-3 justify-end w-full">
          <Button action="secondary" variant="outline" onPress={handleCancel}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={loading || isProfileLoading}
            focusable={!loading}
            className={`${loading ? 'opacity-40 gap-2 cursor-not-allowed' : ''}`}
          >
            {!isProfileLoading ? (
              <>
                {loading && <ButtonSpinner color={colors.gray[700]} />}
                <ButtonText>{loading ? 'Updating' : 'Update'}</ButtonText>
              </>
            ) : (
              <ButtonText>Loading</ButtonText>
            )}
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}

export default EditProfileForm;
