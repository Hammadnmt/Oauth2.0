import jwt from "jsonwebtoken";

export function genToken(user) {
  const { email, id, username } = user;
  const payload = {
    id: id,
    email: email,
    name: username,
  };
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expiration time
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
}
