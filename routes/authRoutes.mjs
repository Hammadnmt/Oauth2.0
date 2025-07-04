import { Router } from "express";
import passport from "passport";
import { genToken } from "../utils/genToken.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";
import { Login } from "../controllers/authController.mjs";
import { googleCallback } from "../controllers/googleController.mjs";
const router = Router();

router.post("/login", passport.authenticate("local"), Login);
router.get("/google", passport.authenticate("google"), (req, res) => {
  console.log("Google authentication successful");
});
router.get("/google/redirect", passport.authenticate("google"), googleCallback);

export default router;
