import { Router } from "express";
import auth from "../middlewares/authMiddleware.mjs";
const router = Router();

router.route("/protected").get(auth, (req, res) => {
  console.log("in protected route");
  res.json({
    message: "Protected resource",
  });
});
export default router;
