import express from "express";
import session from "express-session";
import passport from "passport";
import "dotenv/config.js";
import connectDB from "./config/connection.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import "./strategy/google-auth20.mjs";

connectDB();
const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  console.log(req.user);
  res.send("OAuth Server is running");
});
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${req.user.displayName}`);
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
