export function clearCookies(res, cookies) {
  try {
    cookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
    });
  } catch (error) {
    console.error("Error clearing cookies:", error);
    throw new Error("Failed to clear cookies");
  }
}
