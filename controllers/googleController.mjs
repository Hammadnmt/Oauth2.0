import { User } from "../models/userModel.mjs";
import { genToken } from "../utils/genToken.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";

export async function googleCallback(req, res) {
  try {
    const token = genToken(req.user);
    const refreshToken = genRefreshToken(req.user);
    await User.updateOne(
      { email: req.user.email },
      {
        refresh_token: refreshToken,
      }
    );
    console.log("Refresh token saved for user:", req.user.email);
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "Strict",
    });
    res.status(200).json({
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error in Google callback:", error);
  }
}
