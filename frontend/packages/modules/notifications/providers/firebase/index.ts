import auth from '@react-native-firebase/auth';
import { db } from '@app-launch-kit/modules/init/firebase/firebaseClient';
import config from '@app-launch-kit/config';
import { setDoc } from '@react-native-firebase/firestore';

export const Service: any = {
  async saveTokenInDatabase(token: string): Promise<void> {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.log('No authenticated user found123');
        return;
      }
      const expoTokensRef = db()
        .collection('expo_tokens')
        .doc(`${user.uid}_${token}`);

      await setDoc(
        expoTokensRef,
        {
          user_id: user.uid,
          token: token,
        },
        { merge: true }
      );
    } catch (error: any) {
      console.error('Error in saveTokenToFirebase: ', error);
      throw {
        _original: null,
        error: {
          status: error.status || 500,
          message: error.message || 'An unexpected error occurred.',
        },
      };
    }
  },

  async sendNotification(title: string, body: string): Promise<void> {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.log('No authenticated user found!!!');
        return;
      }

      const response = await fetch(config.env.firebase.FUNCTIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          user_id: user.uid,
          title: title,
          body: body,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
        );
      }
      const { data: result } = await response.json();
      if (Array.isArray(result) && result.length > 0) {
        if (result.every((item) => item.status === 'ok')) {
        } else if (result.some((item) => item.status === 'ok')) {
          console.log(
            'Some notifications sent successfully, others may have failed'
          );
        } else {
          console.warn('All notifications failed to send');
        }
      } else {
        console.warn(
          'Unexpected result format, notification sending status unknown'
        );
      }
    } catch (error) {
      console.error('Error sending notification1111:', error);
    }
  },
};
