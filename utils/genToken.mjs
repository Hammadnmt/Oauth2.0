import jwt from "jsonwebtoken";

export function genToken(user) {
  const { email, id, username, role } = user;
  const payload = {
    id: id,
    email: email,
    name: username,
    role: role,
  };
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });
    return token;
  } catch (error) {
    console.error("Error generating token:");
  }
}
