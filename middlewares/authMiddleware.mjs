import decodeTKN from "../utils/decodeToken.mjs";

export default async function auth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decodedUser = decodeTKN(token);
    if (!decodedUser) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decodedUser; // Attach user info to request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
}
// This middleware checks for the presence of an access token in the request cookies,
