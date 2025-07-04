import jwt from "jsonwebtoken";

export default function decodeRefreshTKN(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error decoding refresh token:", error);
    return null;
  }
}
