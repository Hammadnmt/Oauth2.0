import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/userModel.mjs";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  User.findOne({ email: user.email }, (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, {
      id: user._id,
      username: user.username,
      email: user.email,
      provider: user.provider,
      role: user.role,
    });
  });
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
        const userExists = await User.findOne({ email: email });
        if (!userExists) {
          console.log("User not found");
          return done(null, false, { message: "User not found" });
        }
        if (userExists.provider !== "local") {
          console.log("This email is alread registered");
          return done(null, false, { message: "This email is alread registered" });
        }
        done(null, {
          id: userExists._id,
          username: userExists.username,
          email: userExists.email,
          provider: userExists.provider,
          role: userExists.role,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
