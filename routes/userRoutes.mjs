import { Router } from "express";
import auth from "../middlewares/authMiddleware.mjs";

const router = Router();

router.route("/protected").get(auth, (req, res) => {
  console.log(req.user);
});
export default router;
