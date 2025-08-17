import config from '@app-launch-kit/config';
import { store } from '@app-launch-kit/modules/auth/store';
export const Service: any = {
  async saveTokenInDatabase(token: string): Promise<void> {
    try {
      const userData = await store.get('rest');
      const user_id = userData.user.id;
      if (!user_id) {
        console.log('No authenticated user found');
        return;
      }
      const response = await fetch(
        `${config.env.rest.URL}/v1/notifications/create-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.access_token}`,
          },
          body: JSON.stringify({
            user_id: user_id,
            token: token,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
        );
      }
    } catch (error) {
      console.error('Error in saveTokenInDatabase: ', error);
    }
  },

  async sendNotification(title: string, body: string): Promise<void> {
    try {
      const userData = await store.get('rest');
      const user_id = userData.user.id;
      if (!user_id) {
        console.log('No authenticated user found');
        return;
      }
      const response = await fetch(
        `${config.env.rest.URL}/v1/notifications/send-notifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            title: title,
            body: body,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
        );
      }
    } catch (error) {
      console.error('Error in sendNotification: ', error);
    }
  },
};
