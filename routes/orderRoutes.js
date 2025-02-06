import express from "express";
import {
  listOrders,
  placeOrder,
  getOrder,
  listUserOrders,
  updateOrder,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", listOrders);
router.get("/:id", getOrder);
router.get("/of-user/:userId", listUserOrders);
router.put("/:orderId", updateOrder);
router.delete("/:orderId/delete", cancelOrder);

export default router;
router.post("/add", placeOrder);
