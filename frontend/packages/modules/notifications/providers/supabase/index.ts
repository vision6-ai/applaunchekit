import { client } from '@app-launch-kit/modules/init/supabase/supabaseClient';
import config from '@app-launch-kit/config';

export const Service: any = {
  async saveTokenInDatabase(token: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }
      const { error } = await client.from('expo_tokens').upsert(
        {
          id: `${user.id}_${token}`, // Generate a unique ID
          user_id: user.id,
          token: token,
        },
        { onConflict: 'id' }
      ); // Specify the conflict resolution
      if (error) {
        console.error('Error saving token: ', error);
      }
    } catch (error) {
      console.error('Error in saveTokenToSupabase: ', error);
    }
  },

  async sendNotification(title: string, body: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }
      const response = await fetch(
        `${config.env.supabase.FUNCTIONS_URL}/send-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.env.supabase.ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: user.id,
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

      const result = await response.json();
      if (
        result &&
        result.data &&
        result.data.every((item: any) => item.status === 'ok')
      ) {
        console.log('All notifications sent successfully');
      } else if (
        result &&
        result.data &&
        result.data.some((item: any) => item.status === 'ok')
      ) {
        console.log(
          'Some notifications sent successfully, others may have failed'
        );
      } else {
        console.warn('Notification sending failed');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },
};
