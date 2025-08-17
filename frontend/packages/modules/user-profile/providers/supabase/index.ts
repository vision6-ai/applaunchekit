import { client } from '@app-launch-kit/modules/init/supabase/supabaseClient';
import {
  IUserProfileService,
  IUserProfileResponse,
} from '@app-launch-kit/modules/user-profile/types/IUserProfileProvider';
export const Service: IUserProfileService = {
  async fetchUserProfile(userId: string): Promise<IUserProfileResponse> {
    try {
      const originalResponse = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const response = {
        _original: originalResponse,
        data: originalResponse.data ?? null,
        status: originalResponse.status,
        statusText: originalResponse.statusText,
        error: originalResponse.error ?? undefined,
      };

      return response;
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
      const { data, error, status, statusText } = await client
        .from('users')
        .upsert({
          ...updateData,
          id: userId,
        });

      if (error) {
        return {
          _original: { data, status, statusText },
          data: null,
          error: {
            status: status || 500,
            message: error.message || 'An unexpected error occurred.',
          },
        };
      }

      return {
        _original: { data, status, statusText },
        data,
        error: undefined,
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
