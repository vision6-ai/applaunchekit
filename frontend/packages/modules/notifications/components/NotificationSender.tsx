'use client';
import { useEffect } from 'react';
import {
  Button,
  ButtonText,
} from '@app-launch-kit/components/primitives/button';
import { VStack } from '@app-launch-kit/components/primitives/vstack';
import { Text } from '@app-launch-kit/components/primitives/text';
import { Service } from '@app-launch-kit/modules/notifications/providers';
import { usePushNotifications } from '@app-launch-kit/modules/notifications/hooks/usePushNotifications';
import { useNotificationHandler } from '@app-launch-kit/modules/notifications/hooks/useNotificationHandler';

export default function NotificationSender() {
  const expoPushToken = usePushNotifications();
  useNotificationHandler(); // Call the hook to set up notification handlers

  useEffect(() => {
    if (expoPushToken) {
      Service.saveTokenInDatabase(expoPushToken);
    }
  }, [expoPushToken]);

  const handleSendNotification = async () => {
    if (!expoPushToken) {
      console.error('No push token available');
      return;
    }

    try {
      await Service.sendNotification(
        'Test Notification',
        'This is a test push notification triggered from a button!'
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <VStack space="md" className="self-center p-4">
      <Text>Your expo push token: {expoPushToken}</Text>
      <Button onPress={handleSendNotification}>
        <ButtonText>Send Notification</ButtonText>
      </Button>
    </VStack>
  );
}
