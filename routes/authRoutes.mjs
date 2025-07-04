import { Router } from "express";
import passport from "passport";
import { genToken } from "../utils/genToken.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";
import { Login, Logout, refreshToken } from "../controllers/authController.mjs";
import { googleCallback } from "../controllers/googleController.mjs";
import auth from "../middlewares/authMiddleware.mjs";
const router = Router();

// router.post(
//   "/login",
//   (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         return res.status(401).json({ message: info.message || "Authentication failed" });
//       }
//     });
//   },
//   Login
// );

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: info?.message || "Authentication failed",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return Login(req, res);
    });
  })(req, res, next);
});
router.post("/logout", auth, Logout);
router.post("/refresh-token", refreshToken);
router.get("/google", passport.authenticate("google"), (req, res) => {
  console.log("Google authentication successful");
});
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/api/auth/google",
    session: false, // Disable session for Google auth
  }),
  googleCallback
);

export default router;
