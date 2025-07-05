import googleService from "../services/googleService.mjs";

export async function googleCallback(req, res) {
  try {
    console.log("Google callback user:", req.user);
    const { token, refreshToken } = await googleService.googleCallback(req.user);
    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
    });
    res.status(200).json({
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
}
