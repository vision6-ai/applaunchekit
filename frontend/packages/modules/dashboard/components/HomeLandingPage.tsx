'use client';
import DashboardActionItems from '@app-launch-kit/modules/dashboard/components/ActionItems';
import Leaves from '@app-launch-kit/modules/dashboard/components/Leaves';
import UpcomingHolidays from '@app-launch-kit/modules/dashboard/components/UpcomingHolidays';
import NewColleagues from '@app-launch-kit/modules/dashboard/components/NewColleagues';
import { Box } from '@app-launch-kit/components/primitives/box';
import { Grid, GridItem } from '@app-launch-kit/components/primitives/grid';
import { Heading } from '@app-launch-kit/components/primitives/heading';
import { ScrollView } from '@app-launch-kit/components/primitives/scroll-view';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { Service } from '@app-launch-kit/modules/user-profile';
import { useEffect, useState } from 'react';
import { Alert, AlertText } from '@app-launch-kit/components/primitives/alert';
import { useAuth } from '@app-launch-kit/modules/auth';

const HomeLandingPage = () => {
  const { session } = useAuth();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const profileResponse = await Service.fetchUserProfile(
            session.user.id
          );

          if (profileResponse.error) {
            // Handle error in response
            setError(
              profileResponse.error.message ||
                'An error occurred while fetching profile.'
            );
          } else if (profileResponse.data) {
            // Handle successful profile fetch
            const { data } = profileResponse;
            if (data?.first_name) {
              setUserName(`${data.first_name} ${data?.last_name}`);
            }
          } else {
            // Handle case where no data is returned but no error is present
            setError('Profile data is not available.');
          }
        } catch (error: any) {
          // Handle unexpected errors
          setError(error.message || 'An unexpected error occurred.');
        }
      } else {
        // Handle case where session or user ID is not available
        setError('User ID is missing in the session.');
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <VStack
          className="p-4 md:pb-4 md:px-10 md:pt-5 lg:pt-7 w-full"
          space="2xl"
        >
          <Heading className="hidden md:flex text-3xl text-typography-900 font-bold">
            Dashboard
          </Heading>
          <Heading size="2xl" className="flex md:hidden">
            Welcome {userName}
          </Heading>
          {error && (
            <Alert action="error">
              <AlertText>{error}</AlertText>
            </Alert>
          )}
          <DashboardActionItems />
          <Grid
            className="gap-5"
            _extra={{
              className: 'grid-cols-12',
            }}
          >
            <GridItem
              _extra={{
                className: 'col-span-12 md:col-span-6 lg:col-span-4',
              }}
            >
              <UpcomingHolidays />
            </GridItem>
            <GridItem
              _extra={{
                className: 'col-span-12 md:col-span-6 lg:col-span-4',
              }}
            >
              <Leaves />
            </GridItem>
            <GridItem
              _extra={{
                className: 'col-span-12 md:col-span-6 lg:col-span-4',
              }}
            >
              <NewColleagues />
            </GridItem>
          </Grid>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default HomeLandingPage;
