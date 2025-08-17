const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { userService, tokenService } = require('../services');
const { google } = require('../config/config');

const GOOGLE_CLIENT_ID = google.clientId;
const GOOGLE_CLIENT_SECRET = google.clientSecret;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/v1/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Extract user data from profile
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;
        const profilePicture = photos[0].value;

        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');
        const userBody = { id, email, profile_image_url: profilePicture, first_name: firstName, last_name: lastName };

        // Find or create user in the database
        const user = await userService.createUserByID({ ...userBody, password: 'Goldtre@10__temporary_password' });
        const tokens = await tokenService.generateAuthTokens(user);
        return done(null, { user, tokens });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
