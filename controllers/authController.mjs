import { User } from "../models/userModel.mjs";
import { genToken } from "../utils/genToken.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";

export async function Login(req, res) {
  try {
    const token = genToken(req.user);
    const refreshToken = genRefreshToken(req.user);
    const user = await User.findOne(req.user.email);
    user.refresh_token = refreshToken;
    await user.save();
    console.log("User found and refresh token saved:");
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "Strict",
    });
    res.status(200).json({
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {}
}
