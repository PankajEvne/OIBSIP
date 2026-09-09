import express from "express";
import { adminOnly, protect } from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getMyOrders
} from "../controllers/orderController.js";

const router = express.Router();

// User routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// Admin routes
router.get("/admin/orders", protect, adminOnly, getAllOrders);
router.patch("/admin/orders/:id/status", protect, adminOnly, updateOrderStatus);

router.get("/admin", protect, adminOnly, getAllOrders);
router.patch("/admin/:id/status", protect, adminOnly, updateOrderStatus);

router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;