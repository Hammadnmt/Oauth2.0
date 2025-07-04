import jwt from "jsonwebtoken";

export function genRefreshToken(user) {
  console.log("Generating Refresh Token for user:");
  const { email, id, username, role } = user;
  const payload = {
    id: id,
    email: email,
    name: username,
    role: role,
  };
  try {
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d", // Refresh Token expiration time
    });
    return token;
  } catch (error) {
    console.error("Error generating Refresh token:", error);
  }
}
