import {
  IAuthService,
  IGetSessionResponse,
  IAuthResponse,
  ISignOutResponse,
  IOnAuthStateChangeResponse,
  IUpdateUserResponse,
  IResetPasswordResponse,
  ISendOTPResponse,
} from '@app-launch-kit/modules/auth/types/IAuthProvider';
import { store } from '@app-launch-kit/modules/auth/store';
import { Session } from '@app-launch-kit/modules/auth/types/IAuthContext';
import config from '@app-launch-kit/config';

export const Service: IAuthService = {
  callback: function (event: string, session: Session) {},

  async signUpWithEmailPassword(email: string, password: string) {
    try {
      const res = await fetch(`${config.env.rest.URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const originalResponse = await res.json();

      const response: any = {
        _original: originalResponse,
        data: {
          user: originalResponse.user
            ? {
                id: originalResponse.user.id,
                email: originalResponse.user.email,
              }
            : null,
          session: originalResponse.tokens
            ? {
                access_token: originalResponse.tokens.access.token,
                refresh_token: originalResponse.tokens.refresh.token,
              }
            : null,
        },
        error: originalResponse.code
          ? {
              status: originalResponse.code,
              message: originalResponse.message!,
            }
          : null,
      };
      if (response.data.user) {
        const userDetail = {
          ...response.data.session,
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
          },
        };
        const storeData = {
          access_token_expires: new Date(
            originalResponse.tokens.access.expires
          ).getTime(),
          refresh_token_expires: new Date(
            originalResponse.tokens.refresh.expires
          ).getTime(),
          ...userDetail,
        };
        await store.set('rest', storeData);
        this.callback!('SIGNED_IN', userDetail);
      }

      return { ...response };
    } catch (err: any) {
      const response: any = {
        _original: null,
        data: {
          user: null,
          session: null,
        },
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
      return { ...response };
    }
  },

  async signInWithEmailPassword(email: string, password: string) {
    try {
      const res = await fetch(`${config.env.rest.URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const originalResponse = await res.json();
      const response: any = {
        _original: originalResponse,
        data: {
          user: originalResponse.user
            ? {
                id: originalResponse.user.id,
                email: originalResponse.user.email,
              }
            : null,
          session: originalResponse.tokens
            ? {
                access_token: originalResponse.tokens.access.token,
                refresh_token: originalResponse.tokens.refresh.token,
              }
            : null,
        },
        error: originalResponse.code
          ? {
              status: originalResponse.code,
              message: originalResponse.message!,
            }
          : null,
      };
      if (response.data.user) {
        const userDetail = {
          ...response.data.session,
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
          },
        };
        const storeData = {
          access_token_expires: new Date(
            originalResponse.tokens.access.expires
          ).getTime(),
          refresh_token_expires: new Date(
            originalResponse.tokens.refresh.expires
          ).getTime(),
          ...userDetail,
        };
        await store.set('rest', storeData);
        this.callback!('SIGNED_IN', userDetail);
      }

      return { ...response };
    } catch (err: any) {
      const response: any = {
        _original: null,
        data: {
          user: null,
          session: null,
        },
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
      return { ...response };
    }
  },

  async sendOTP(phoneNumber: string): Promise<ISendOTPResponse> {
    const verifyOTP = async (otp: string) => {
      try {
        const res = await fetch(`${config.env.rest.URL}/v1/auth/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone_number: phoneNumber, otp }),
        });

        const originalResponse = await res.json();
        const response: any = {
          _original: originalResponse,
          data: {
            user: originalResponse.user
              ? {
                  id: originalResponse.user.id,
                  email: originalResponse.user.email,
                }
              : null,
            session: originalResponse.tokens
              ? {
                  access_token: originalResponse.tokens.access.token,
                  refresh_token: originalResponse.tokens.refresh.token,
                }
              : null,
          },
          error: originalResponse.code
            ? {
                status: originalResponse.code,
                message: originalResponse.message!,
              }
            : null,
        };
        if (response.data.user) {
          const userDetail = {
            ...response.data.session,
            user: {
              id: response.data.user.id,
              email: response.data.user.email,
            },
          };
          const storeData = {
            access_token_expires: new Date(
              originalResponse.tokens.access.expires
            ).getTime(),
            refresh_token_expires: new Date(
              originalResponse.tokens.refresh.expires
            ).getTime(),
            ...userDetail,
          };
          await store.set('rest', storeData);
          this.callback!('SIGNED_IN', userDetail);
        }

        return { ...response };
      } catch (err: any) {
        const response: any = {
          _original: null,
          data: {
            user: null,
            session: null,
          },
          error: {
            status: err.status || 500,
            message: err.message || 'An unexpected error occurred.',
          },
        };
        return { ...response };
      }
    };

    try {
      const res = await fetch(`${config.env.rest.URL}/v1/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      if (res.ok) {
        return { data: { verifyOTP }, error: null };
      } else {
        const responseData = await res.json();
        return {
          _original: null,
          data: null,
          error: {
            status: responseData.code || 500,
            message: responseData.message || 'An unexpected error occurred.',
          },
        };
      }
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

  async signOut(): Promise<ISignOutResponse> {
    try {
      const { refresh_token } = await store.get('rest');
      const res = await fetch(`${config.env.rest.URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refresh_token }),
      });

      if (res.ok) {
        await store.clear('rest');
        this.callback!('SIGNED_OUT', null);
        return { error: null };
      } else {
        const responseData = await res.json();
        return {
          error: {
            status: responseData.code || 500,
            message: responseData.message || 'An unexpected error occurred.',
          },
        };
      }
    } catch (err: any) {
      return {
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
    }
  },

  async resetPassword(
    email: string,
    redirectTo: string
  ): Promise<IResetPasswordResponse> {
    try {
      const res = await fetch(
        `${config.env.rest.URL}/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ redirectTo, email }),
        }
      );

      if (res.ok) {
        return { error: null };
      } else {
        const responseData = await res.json();
        return {
          error: {
            status: responseData.code || 500,
            message: responseData.message || 'An unexpected error occurred.',
          },
        };
      }
    } catch (err: any) {
      return {
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
    }
  },

  async getSession(): Promise<IGetSessionResponse> {
    try {
      const data = await store.get('rest');
      if (!data?.access_token_expires || !data?.access_token) {
        return {
          data: { session: null },
          error: null,
        };
      }
      const { access_token_expires, refresh_token_expires, ...sessionData } =
        data;

      const currentTime = new Date();

      if (
        refresh_token_expires <= currentTime ||
        !refresh_token_expires ||
        !access_token_expires ||
        !sessionData.refresh_token ||
        !sessionData.access_token
      ) {
        // Refresh Token is expired or token not exist, logout
        this.signOut();
      }
      if (access_token_expires <= currentTime) {
        // refresh and get new tokens from backend
        const refreshToken = sessionData.refresh_token;
        try {
          const res = await fetch(
            `${config.env.rest.URL}/v1/auth/refresh-tokens`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            }
          );
          const originalResponse = await res.json();
          if (res.ok) {
            const userDetail = {
              ...sessionData,
              access_token: originalResponse.access.token,
              refresh_token: originalResponse.refresh.token,
            };
            await store.set('rest', {
              access_token_expires: originalResponse.access.expires,
              refresh_token_expires: originalResponse.refresh.expires,
              userDetail,
            });
          } else {
            this.signOut();
          }
        } catch (e: any) {
          this.signOut();
          return {
            data: {
              session: null,
            },
            error: {
              status: e.status || 500,
              message: e.message || 'An unexpected error occured',
            },
          };
        }
      }

      return {
        data: {
          session: sessionData,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: { session: null },
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
    }
  },

  async setSession(
    params: any
    // accessToken: string,
    // refreshToken: string
  ): Promise<IAuthResponse> {
    try {
      await store.set('rest', {
        token: params.token,
      });
      return {
        data: {
          session: {
            access_token: params?.token,
            refresh_token: '',
          },
          user: null,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: {
          session: null,
          user: null,
        },
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
    }
  },

  async updateUser(updateData: {
    email?: string;
    password?: string;
  }): Promise<IUpdateUserResponse> {
    try {
      const userData = await store.get('rest');
      const res = await fetch(
        `${config.env.rest.URL}/v1/auth/reset-password?token=${userData.token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: updateData.password }),
        }
      );

      if (res.ok) {
        await store.clear('rest');
        return {
          _original: null,
          data: {
            user: null,
          },
          error: null,
        };
      } else {
        const responseData = await res.json();
        return {
          _original: null,
          data: {
            user: null,
          },
          error: {
            status: responseData.code || 500,
            message: responseData.message || 'An unexpected error occurred.',
          },
        };
      }
    } catch (err: any) {
      return {
        data: {
          user: null,
        },
        error: {
          status: err.status || 500,
          message: err.message || 'An unexpected error occurred.',
        },
      };
    }
  },

  // @ts-ignore
  async signInWithIdToken(provider: string, idToken: string) {
    if (provider) {
      try {
        const res = await fetch(`${config.env.rest.URL}/v1/auth/google`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${idToken}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        });
      } catch (err: any) {
        return {
          data: { user: null, session: null },
          error: null,
        };
      }
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get('data');
      if (!encodedData) {
        return {
          data: { user: null, session: null },
          error: null,
        };
      }
      const decodedData = decodeURIComponent(encodedData!);
      const authData = JSON.parse(decodedData);
      store.set('rest', authData);
      this.callback!('SIGNED_IN', authData);
      return authData;
    }
  },
  async onAuthStateChange(
    callback: (event: string, session: any) => void
  ): Promise<IOnAuthStateChangeResponse> {
    this.callback = callback;

    const response: IOnAuthStateChangeResponse = {
      subscription: {},
      unsubscribe: () => {},
    };

    return response;
  },
};
