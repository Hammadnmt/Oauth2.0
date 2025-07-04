import decodeTKN from "../utils/decodeToken.mjs";

export default async function auth(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      decodeTKN(req.cookies?.accessToken);
    }
  } catch (error) {
    console.log(error);
  }
  next();
}
