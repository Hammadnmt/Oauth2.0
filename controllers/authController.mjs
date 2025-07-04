import { User } from "../models/userModel.mjs";
import { genToken } from "../utils/genToken.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";
import decodeTKN from "../utils/decodeToken.mjs";
import decodeRefreshTKN from "../utils/decodeRefreshTKN.mjs";

export async function Login(req, res) {
  try {
    const token = genToken(req.user);
    const refreshToken = genRefreshToken(req.user);
    await User.updateOne(
      { email: req.user.email },
      {
        refresh_token: refreshToken,
      }
    );

    console.log("User found and refresh token saved:");
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true, // Set to true in production (HTTPS)
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.send("Logged IN");
  } catch (error) {}
}

export async function Logout(req, res) {
  try {
    await User.UpdateOne({ email: req.user.email }, { refresh_token: null });
    res.clearCookie("accessToken");
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
}

export async function refreshToken(req, res) {
  try {
    // const refreshToken = req.cookies?.refreshToken;
    const decoded = decodeRefreshTKN(refreshToken);
    console.log("Refresh token:", req.cookies, decoded);
    const user = await User.findOne({ email: decoded.email });
    if (refreshToken != user.refresh_token) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const newAccessToken = genToken(req.user);
    const newRefreshToken = genRefreshToken(req.user);
    user.refresh_token = newRefreshToken;
    await user.save();
    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/refresh-token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
}
