import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

/**
 * This hook sets up the notification handler for the app.
 * It configures how notifications are handled, including how to show an alert, play a sound, and set a badge.
 * It also sets up listeners for incoming notifications and notification responses.
 *
 * When the component mounts, it sets up the notification handler and adds listeners for incoming notifications and notification responses.
 * When the component unmounts, it removes these listeners to prevent memory leaks.
 */
export const useNotificationHandler = () => {
  useEffect(() => {
    // Set up notification handler to always show an alert, play a sound, and set a badge for incoming notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Add a listener to log incoming notifications to the console
    const notificationSubscription =
      Notifications.addNotificationReceivedListener((receivedNotification) => {
        console.log('Notification received!', receivedNotification);
      });

    // Add a listener to log notification responses to the console
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        (receivedResponse) => {
          console.log('Notification response:', receivedResponse);
        }
      );

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
};
