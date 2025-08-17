import { client } from '@app-launch-kit/modules/init/supabase/supabaseClient';
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

    try {
      const arrayBuffer = await fetch(mediaUri).then((res) =>
        res.arrayBuffer()
      );
      const mimeType = 'image/jpeg'; // Adjust as needed
      const fileExt = mimeType.split('/')[1] || 'jpeg';
      const path = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await client.storage
        .from(mediaStoragePath)
        .upload(path, arrayBuffer, { contentType: mimeType });

      if (uploadError) {
        return {
          _original: uploadError,
          error: {
            status: 500,
            message: uploadError.message,
          },
        };
      }

      const { data: returnedData } = await client.storage
        .from(mediaStoragePath)
        .getPublicUrl(data.path);

      return {
        _original: returnedData,
        data: {
          path: data.path,
          fullPath: returnedData.publicUrl || '',
        },
        error: undefined,
      };
    } catch (error) {
      return {
        _original: error,
        error: {
          status: (error as any)?.status || 500,
          message: (error as Error).message || 'An unexpected error occurred.',
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

    try {
      const { error: deleteError } = await client.storage
        .from(mediaStoragePath)
        .remove([mediaUri]);

      if (deleteError) {
        return {
          _original: deleteError,
          error: {
            status: 500,
            message: deleteError.message,
          },
        };
      }

      return {
        _original: null,
        error: undefined,
      };
    } catch (error) {
      return {
        _original: error,
        error: {
          status: (error as any)?.status || 500,
          message: (error as Error).message || 'An unexpected error occurred.',
        },
      };
    }
  },
};
