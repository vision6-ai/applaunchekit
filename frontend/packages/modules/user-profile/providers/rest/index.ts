import { store } from '@app-launch-kit/modules/auth/store';
import config from '@app-launch-kit/config';
import {
  IUserProfileService,
  IUserProfileResponse,
} from '@app-launch-kit/modules/user-profile/types/IUserProfileProvider';

export const Service: IUserProfileService = {
  async fetchUserProfile(userId: string): Promise<IUserProfileResponse> {
    try {
      const userData = await store.get('rest');
      const originalResponse = await fetch(
        `${config.env.rest.URL}/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.access_token}`,
          },
        }
      );
      const data = await originalResponse.json();
      if (originalResponse.ok) {
        return {
          _original: data,
          data: data ?? null,
          status: originalResponse.status,
          statusText: originalResponse.statusText,
        };
      }
      return {
        _original: data,
        data: null,
        error: {
          status: data.code,
          message: data.message,
        },
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

  async updateUserProfile(
    userId: string,
    updateData: any
  ): Promise<IUserProfileResponse> {
    try {
      const userData = await store.get('rest');
      const originalResponse = await fetch(
        `${config.env.rest.URL}/v1/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${userData.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );
      const data = await originalResponse.json();
      if (originalResponse.ok) {
        return {
          _original: data,
          data: data,
          status: originalResponse.status,
          statusText: originalResponse.statusText,
        };
      }
      return {
        _original: data,
        data: null,
        error: {
          status: data.code,
          message: data.message,
        },
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
