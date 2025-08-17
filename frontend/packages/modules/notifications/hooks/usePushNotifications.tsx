import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * This hook is used to register the device for push notifications.
 * It requests permissions, gets the push token, and sets up the notification channel.
 * The push token is then returned.
 */
export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== 'granted') {
          alert('Failed to get push token for push notifications!');
          return;
        }

        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: 'a38b0c54-4bd7-46af-a029-9b97b9689d03',
          })
        ).data;

        setExpoPushToken(token);

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };

    registerForPushNotifications();
  }, []);

  return expoPushToken;
};
