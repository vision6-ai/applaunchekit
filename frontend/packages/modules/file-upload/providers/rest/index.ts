import { store } from '@app-launch-kit/modules/auth/store';
import config from '@app-launch-kit/config';
import {
  IFileUploadProvider,
  IUploadMediaResponse,
  IDeleteMediaResponse,
} from '@app-launch-kit/modules/file-upload/types/IFileUploadProvider';

export const Service: IFileUploadProvider = {
  async uploadMedia(
    mediaUri: string,
    mediaStoragePath: string
  ): Promise<IUploadMediaResponse> {
    if (!mediaUri) {
      return {
        _original: null,
        error: {
          status: 400,
          message: 'No image URI provided!',
        },
      };
    }

    const userData = await store.get('rest');

    try {
      // Upload the blob to Firebase Storage
      const originalResponse = await fetch(
        `${config.env.rest.URL}/v1/files/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.access_token}`,
          },
          body: JSON.stringify({
            fileData: mediaUri,
            bucketName: mediaStoragePath,
          }),
        }
      );

      // Return the download URL
      const data = await originalResponse.json();

      return {
        _original: data,
        data: {
          path: data.path,
          fullPath: data.fullPath,
        },
        error: undefined,
      };
    } catch (error: any) {
      return {
        _original: error,
        error: {
          status: error.status || 500,
          message:
            error.message || 'An unexpected error occurred during upload.',
        },
      };
    }
  },

  async deleteMedia(
    mediaUri: string,
    mediaStoragePath: string
  ): Promise<IDeleteMediaResponse> {
    if (!mediaUri) {
      return {
        _original: null,
        error: {
          status: 400,
          message: 'No image path provided!',
        },
      };
    }

    const userData = await store.get('rest');

    try {
      const originalResponse = await fetch(
        `${config.env.rest.URL}/v1/files/remove`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.access_token}`,
          },
          body: JSON.stringify({
            fileUrl: mediaUri,
            bucketName: mediaStoragePath,
          }),
        }
      );
      const data = await originalResponse.json();
      if (originalResponse.ok) {
        return {
          _original: data,
          error: undefined,
        };
      }
      return {
        _original: data,
        error: {
          status: data.code,
          message: data.message,
        },
      };
    } catch (error: any) {
      return {
        _original: error,
        error: {
          status: error.status || 500,
          message: error.message || 'An unexpected error occurred.',
        },
      };
    }
  },
};
