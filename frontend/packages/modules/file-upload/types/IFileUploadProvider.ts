export interface IUploadMediaResponse {
  _original: any;
  data?: {
    path: string;
    fullPath: string;
  };
  error?: {
    status: number;
    message: string;
  };
}

export interface IDeleteMediaResponse {
  _original: any;
  data?: null;
  error?: {
    status: number;
    message: string;
  };
}

export interface IFileUploadProvider {
  uploadMedia(
    mediaUri: string,
    mediaStoragePath: string
  ): Promise<IUploadMediaResponse>;
  deleteMedia(
    mediaUri: string,
    mediaStoragePath: string
  ): Promise<IDeleteMediaResponse>;
}
