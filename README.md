# AppLaunchKit

AppLaunchKit is a powerful and flexible starter kit designed for building universal applications. It combines Expo for mobile development and Next.js for web applications, providing a unified codebase for apps that run seamlessly on iOS, Android, and the web.

## Key Features

- **Cross-Platform Development**: Build for multiple platforms using a single, shared codebase.
- **Modular Monorepo Structure**: Organized architecture with dedicated sections for Expo and Next.js apps, plus shared resources.
- **Expo and Next.js Integration**: Leverages Expo's tools for mobile and Next.js optimizations for web.
- **Shared Resources**: Centralized repository for reusable components, UI elements, hooks, and services.
- **Modules**: Includes modules for Authentication, User-Profile, File-Upload,Notifications, Dashboard, Landing-Page, each module is a self-contained entity with its own assets, components, hooks, and other necessary files.
- **Authentication Solutions**: Includes NextAuth.js and Expo Auth Session for secure user authentication.
- **Notifications**: Includes push notifications for native apps.
- **Database**: Includes database for user-profile and file-upload modules.
- **Storage**: Includes storage for file-upload module.
- **Pre-built Core Features**: Comes with protected routes, email delivery integration, and Stripe integration for payments.
- **Developer Tools**: Pre-configured with Storybook, ESLint, and Prettier for improved development workflow.
- **TypeScript Support**: Includes TypeScript configuration for type-safe development.

AppLaunchKit provides a comprehensive foundation for your project, focusing on cross-platform compatibility, code reusability, and development efficiency. It empowers developers to build robust, scalable, and maintainable universal applications with a consistent user experience across all platforms.

## Getting Started

### ExpressJS Server

- Navigate to the `backend/express-js` directory from the root of the project.

  ```bash
  cd backend/express-js
  ```

- Start your Custom ExpressJS server.

  ```bash
  npm run dev
  ```

- Start the server in docker container

  ```bash
  npm run docker:dev
  ```

No additional setup is required for Firebase, Just create a project in the Firebase console and add the credentials in the env file.

If you want to use firebase for edge functions, you can use the local instance of firebase-functions in the `backend/firebase/functions` directory.

Run the following command to start the firebase functions server:

```bash
cd backend/firebase/functions
npm install
npm run serve
# It will give you the URL to access the firebase functions server,
# You can use it as an API endpoint in your application.
```

> If you want to also watch the firebase functions code and automatically restart the server on changes, you can run the following command:

```bash
# Run this in a new terminal
npm run build:watch
```

### Supabase Server

- Navigate to the `backend/supabase` directory from the root of the project.

  ```bash
  cd backend/supabase
  ```

- Start your Supabase local server.

  ```bash
  npx supabase@latest start
  ```

- Stop the supabase server:

  ```bash
  npx supabase@latest stop
  ```

- Reset the supabase server:

  ```bash
  npx supabase@latest db reset
  ```

For more details on the usage of these commands please read more on the official documentation page of [Supabase CLI](https://supabase.com/docs/guides/cli)

### Expo App

- Navigate to the `frontend` directory from the root of the project.

  ```bash
  cd frontend
  ```

- Start the Expo app for Android.

  ```bash
  npm run expo:android
  ```

- Start the Expo app for iOS.

  ```bash
  npm run expo:ios
  ```

### Next.js Web App

- Navigate to the `frontend` directory from the root of the project.

  ```bash
  cd frontend
  ```

- Start the Next.js app.

  ```bash
  npm run next:dev
  ```

## Environment Variables Configuration

The project uses environment variables for configuration across different services. Here's a guide to setting up the required environment variables:

### Frontend Environment Variables

#### Expo App (`frontend/apps/expo/.env.development`)

- `EXPO_PUBLIC_SITE_URL`: Your site's URL (default: http://localhost:8080)
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `EXPO_PUBLIC_FIREBASE_*`: Firebase configuration (get from Firebase Console)
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID_*`: Google OAuth client IDs for different platforms
- `EXPO_PUBLIC_REST_BACKEND_URL`: Your Express.js backend URL
- `EXPO_PUBLIC_STRIPE_*`: Stripe configuration (if using payments)

#### Next.js App (`frontend/apps/next/.env.development`)

- `NEXT_PUBLIC_SITE_URL`: Your site's URL (default: http://localhost:3000)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration (get from Firebase Console)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID_WEB`: Google OAuth client ID for web
- `NEXT_PUBLIC_REST_BACKEND_URL`: Your Express.js backend URL
- `NEXT_PUBLIC_STRIPE_*`: Stripe configuration (if using payments)

### Backend Environment Variables

#### Express.js Server (`backend/express-js/.env.example`)

- `PORT`: Server port (default: 8080)
- `MONGODB_URL`: MongoDB connection URL
- `JWT_*`: JWT configuration for authentication
- `SMTP_*`: Email service configuration
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `MINIO_*`: MinIO storage configuration
- `TWILIO_*`: Twilio configuration for SMS/OTP

#### Supabase Server (`backend/supabase/.env.development`)

- `SUPABASE_API_URL`: Supabase API URL (default: http://127.0.0.1:54323)
- `SITE_URL`: Your site's URL
- `SUPABASE_SMTP_*`: Email service configuration
- `SUPABASE_AUTH_GOOGLE_*`: Google OAuth configuration

### Getting API Keys and Credentials

1. **Supabase**: Create a project at [Supabase](https://supabase.com) and get your project URL and anon key.
2. **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com) and get your configuration.
3. **Google OAuth**: Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com).
4. **Stripe**: Create an account at [Stripe](https://stripe.com) and get your API keys.
5. **Twilio**: Create an account at [Twilio](https://www.twilio.com) for SMS/OTP functionality.

### Security Notes

- Never commit sensitive environment variables to version control
- Use different API keys for development and production
- Keep your `.env` files in `.gitignore`
- Use environment variable encryption for production deployments
