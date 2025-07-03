import { Router } from "express";
import passport from "passport";
import { genToken } from "../utils/genToken.mjs";
const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Local authentication successful");
  const token = genToken(req.user);
  res.cookie("accessToken", token, {
    httpOnly: true,
  });
  res.status(200).json({
    message: "Login successful",
  });
});
router.get("/google", passport.authenticate("google"), (req, res) => {
  console.log("Google authentication successful");
});
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("Google redirect successful");
  console.log("im user");
  res.cookie("accessToken", genToken(req.user), {
    httpOnly: true,
  });
  res.redirect("http://localhost:3000/dashboard"); // Redirect to your frontend or desired URL
});

export default router;
