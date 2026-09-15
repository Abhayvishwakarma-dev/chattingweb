import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Check if Google credentials exist
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Only initialize if real credentials are provided
const isGoogleConfigured = googleClientId && 
                          googleClientSecret && 
                          googleClientId !== 'your_google_client_id_here' &&
                          googleClientSecret !== 'your_google_client_secret_here';

if (isGoogleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const name = profile.displayName || profile.name?.givenName || "Google User";
          const profileImage = profile.photos?.[0]?.value || "";

          let user = await User.findOne({ googleId: profile.id });

          if (!user && email) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name,
              email,
              googleId: profile.id,
              profileImage,
              authProvider: "google",
              isVerified: true,
            });
          } else {
            user.googleId = profile.id;
            if (profileImage) user.profileImage = profileImage;
            user.authProvider = "google";
            user.isVerified = true;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          console.error("Google Strategy Error:", error);
          return done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth initialized successfully');
} else {
  console.log('⚠️  Google OAuth is disabled - Add your credentials to .env');
  console.log('   To enable, get client ID & secret from: https://console.cloud.google.com/');
}

export default passport;