import { User } from "../models/userModel.mjs";
import decodeRefreshTKN from "../utils/decodeRefreshTKN.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";
import { genToken } from "../utils/genToken.mjs";

const authService = {
  Login: async (user) => {
    try {
      const token = genToken(user);
      const refreshToken = genRefreshToken(user);
      await User.findOneAndUpdate(
        { email: user.email },
        {
          refresh_token: refreshToken,
        }
      );
      console.log("User found and refresh token saved:");
      return {
        token: token,
        refreshToken: refreshToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  },
  Logout: async (email) => {
    try {
      await User.findOneAndUpdate({ email: email }, { refresh_token: null });
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  },
  RefreshToken: async (token) => {
    try {
      const decoded = decodeRefreshTKN(token);
      const user = await User.findOne({ email: decoded.email });
      if (!user || user.refresh_token !== token) {
        throw new Error("Invalid refresh token");
      }

      // Rotate tokens
      const newAccessToken = genToken(user);
      const newRefreshToken = genRefreshToken(user);
      user.refresh_token = newRefreshToken;
      await user.save();
      return {
        newAccessToken: newAccessToken,
        newRefreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Refresh token error:", error);
      throw new Error("Refresh token failed");
    }
  },
};
export default authService;
