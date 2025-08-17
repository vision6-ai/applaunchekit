import { storage } from '@app-launch-kit/modules/init/firebase/firebaseClient.web';
import {
  deleteObject,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
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

    // Decode base64 string to a Uint8Array
    const byteCharacters = atob(mediaUri.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the Uint8Array
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust type if needed

    // Generate a unique filename
    const filename = `${Date.now()}.jpg`;

    // Create a reference to the storage location
    const storageRef = ref(storage, `${mediaStoragePath}/${filename}`);

    try {
      // Upload the blob to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Return the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        _original: snapshot,
        data: {
          path: snapshot.ref.fullPath,
          fullPath: downloadURL,
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

    try {
      const storageRef = ref(storage, `${mediaStoragePath}/${mediaUri}`); // Replace with the path to your file
      await deleteObject(storageRef);

      return {
        _original: null,
        error: undefined,
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
