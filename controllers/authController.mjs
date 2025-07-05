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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.send("Logged IN");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function Logout(req, res) {
  try {
    console.log("logout", req.user);
    await User.findOneAndUpdate({ email: req.user.email }, { refresh_token: null });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
}

export async function refreshToken(req, res) {
  try {
    console.log("Refreshing token for user:", req.user);
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Missing token" });

    const decoded = decodeRefreshTKN(refreshToken);
    const user = await User.findOne({ email: decoded.email });
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Invalid or reused token" });
    }

    // Rotate tokens
    const newAccessToken = genToken(user);
    const newRefreshToken = genRefreshToken(user);
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
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}
