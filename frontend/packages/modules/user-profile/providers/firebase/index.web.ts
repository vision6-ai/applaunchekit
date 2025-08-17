import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@app-launch-kit/modules/init/firebase/firebaseClient.web';
import {
  IUserProfileService,
  IUserProfileResponse,
} from '@app-launch-kit/modules/user-profile/types/IUserProfileProvider';
export const Service: IUserProfileService = {
  async fetchUserProfile(userId: string): Promise<IUserProfileResponse> {
    try {
      const userRef = doc(db, 'users', userId);
      const originalResponse = await getDoc(userRef);
      if (originalResponse.exists()) {
        const data = originalResponse.data();
        const response = {
          _original: originalResponse,
          data: data,
          status: 200,
          statusText: 'User Data found',
        };
        return response;
      }

      return {
        _original: null,
        data: null,
        status: 404,
        statusText: 'User Data not found',
        error: {
          status: 404,
          message: 'User Data not found',
        },
      };
    } catch (err: any) {
      const response = {
        _original: null,
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };

      return response;
    }
  },

  async updateUserProfile(
    userId: string,
    updateData: any
  ): Promise<IUserProfileResponse> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, updateData);

      return {
        _original: null,
        data: null,
      };
    } catch (err: any) {
      return {
        _original: null,
        data: null,
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
    }
  },
};
