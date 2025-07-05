import { User } from "../models/userModel.mjs";
import { genToken } from "../utils/genToken.mjs";
import { genRefreshToken } from "../utils/genRefreshToken.mjs";

const googleService = {
  googleCallback: async (user) => {
    try {
      const token = genToken(user);
      const refreshToken = genRefreshToken(user);
      await User.updateOne(
        { email: user.email },
        {
          refresh_token: refreshToken,
        }
      );
      console.log("Refresh token saved for user:", user.email);
      return {
        token,
        refreshToken,
      };
    } catch (error) {
      console.error("Error in Google callback:", error);
      throw new Error("Google callback failed");
    }
  },
};
export default googleService;
