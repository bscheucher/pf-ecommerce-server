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

const router = express.Router();

router.post("/add", placeOrder);
router.get("/", authenticateToken, listOrders);
router.get("/:id", authenticateToken, getOrder);
router.get("/of-user/:userId", authenticateToken, listUserOrders);
router.put("/:orderId", authenticateToken, updateOrder);
router.delete("/:orderId/delete", authenticateToken, cancelOrder);

export default router;
