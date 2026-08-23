import express from "express";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  verifyEmail,
  googleAuth,
} from "./authUsers.controller.js";
import { verifyToken } from "../../middlewares/tokens.js";
import passport from "../../config/passport.js";

const router = express.Router();

router.post("/user/signup", signup);
router.post("/user/login", login);

router.get("/verify-email", verifyEmail);

router.get("/user/profile", verifyToken, getProfile);
router.patch("/user/profile", verifyToken, updateProfile);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleAuth,
);
export default router;
