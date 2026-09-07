import express from "express";
import { 
  register,
  verifyEmail,
  login,
  adminLogin,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.get("/verify-email/:token", verifyEmail);

router.post("/login", login);

router.post("/admin-login", adminLogin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPassword);

export default router;