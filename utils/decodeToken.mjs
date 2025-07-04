import jwt from "jsonwebtoken";

export default function decodeTKN(token) {
  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodedUser", decodedUser);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null; // Return null or handle the error as needed
  }
}
