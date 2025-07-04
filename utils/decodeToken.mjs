import jwt from "jsonwebtoken";

export default function decodeTKN(token) {
  const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decodedUser", decodedUser);
}
