import { Router } from "express";
import passport from "passport";
const router = Router();

router.get("/google", passport.authenticate("google"), (req, res) => {
  console.log("Google authentication successful");
});
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("Google redirect successful");
});

export default router;
