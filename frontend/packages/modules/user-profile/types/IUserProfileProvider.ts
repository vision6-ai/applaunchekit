export interface IUserProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  gender?: string;
  city?: string;
  country?: string;
  state?: string;
  zipcode?: string;
  profile_image_url?: string | null;
  cover_image_url?: string | null;
}

export interface IUserProfileResponse {
  _original: unknown; // Change 'any' to 'unknown' for better type safety
  data?: IUserProfile | null;
  status?: number;
  statusText?: string;
  error?:
    | {
        status?: number;
        message?: string;
      }
    | undefined;
}

export interface IUserProfileService {
  fetchUserProfile(userId: string): Promise<IUserProfileResponse>;

  updateUserProfile(
    userId?: string,
    updateData?: IUserProfile
  ): Promise<IUserProfileResponse>;
}
