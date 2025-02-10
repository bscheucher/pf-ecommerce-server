import express from "express";
import {
  listOrders,
  placeOrder,
  getOrder,
  listUserOrders,
  updateOrder,
  cancelOrder,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { adminRequired } from "../middleware/adminRequired.js";

const router = express.Router();

router.post("/add", authenticateToken, placeOrder);
router.get("/", authenticateToken, adminRequired, listOrders);
router.get("/:id", authenticateToken, adminRequired, getOrder);
router.get("/of-user/:userId", authenticateToken, listUserOrders);
router.put("/:orderId", authenticateToken, adminRequired, updateOrder);
router.delete("/:orderId/delete", authenticateToken, adminRequired, cancelOrder);

export default router;
