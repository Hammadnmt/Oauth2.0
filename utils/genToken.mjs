import jwt from "jsonwebtoken";

export function genToken(user) {
  const payload = {
    id: user.id,
    email: user.emails[0].value,
    name: user.displayName,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expiration time
  });

  return token;
}
