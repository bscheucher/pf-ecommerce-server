import express from "express";
import {
  placeOrder,
  getOrder,
  listUserOrders,
  updateOrder,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/add", placeOrder);
router.get("/:id", getOrder);
router.get("/of-user/:userId", listUserOrders);
router.put("/:orderId", updateOrder);
router.delete("/:orderId/delete", cancelOrder);

export default router;
