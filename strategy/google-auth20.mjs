import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userModel.mjs";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  try {
    // If user is already serialized, we can directly return it
    if (user && user.id) {
      return done(null, user);
    }
    // If user is not serialized, we can fetch it from the database
    User.findById(user.id)
      .then((foundUser) => {
        if (!foundUser) {
          return done(new Error("User not found"), null);
        }
        done(null, {
          id: foundUser._id,
          username: foundUser.username,
          email: foundUser.email,
          provider: foundUser.provider,
          role: foundUser.role,
        });
      })
      .catch((err) => done(err, null));
  } catch (error) {}
  console.log("Deserializing user:", user);
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
                email: profile.emails[0].value,
                provider: "google",
                role: existingUser.role,
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
