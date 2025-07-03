import { Router } from "express";
import passport from "passport";
import { genToken } from "../utils/genToken.mjs";
const router = Router();

router.get("/google", passport.authenticate("google"), (req, res) => {
  console.log("Google authentication successful");
});
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("Google redirect successful");

  res.redirect("http://localhost:3000/dashboard"); // Redirect to your frontend or desired URL
});

export default router;
