import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/userModel.mjs";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Local strategy for email and password authentication
export default passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log("local strategy");
        const userExists = await User.findOne({ email });
        if (!userExists) {
          console.log("User not found");
          return done(null, false, { message: "User not found" });
        }
        done(null, {
          id: userExists._id,
          username: userExists.username,
          email: userExists.email,
          provider: "local",
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
