import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.mjs";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        User.findOne({ googleId: profile.id })
          .then((existingUser) => {
            if (existingUser) {
              return done(null, {
                id: profile.id,
                username: profile.displayName,
                emails: profile.emails[0].value,
                provider: "google",
              });
            } else {
              // Create a new user
              const newUser = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                provider: "google",
                googleId: profile.id,
                profilePhoto: profile.photos[0].value,
              });
              return newUser.save().then((user) =>
                done(null, {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                })
              );
            }
          })
          .catch((err) => done(err, null));
      } catch (error) {
        done(error, null);
      }
    }
  )
);
