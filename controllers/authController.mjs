import authService from "../services/authService.mjs";
import { clearCookies } from "../utils/cookieClear.mjs";

export async function Login(req, res) {
  try {
    const { token, refreshToken } = await authService.Login(req.user);
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function Logout(req, res) {
  try {
    await authService.Logout(req.user.email);
    clearCookies(res, ["accessToken", "refreshToken"]);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
}

export async function refreshToken(req, res) {
  try {
    console.log("Refreshing token for user:", req.user);
    const refreshToken = req.cookies?.refreshToken;
    const { newAccessToken, newRefreshToken } = await authService.RefreshToken(refreshToken);

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
