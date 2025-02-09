import express from "express";
import {
  initiatePayment,
  getPaymentDetails,
  updatePayment,
  getOrderPayments,
} from "../controllers/paymentController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add", authenticateToken, initiatePayment);
router.get("/:paymentId", authenticateToken, getPaymentDetails);
router.get("/of-order/:orderId", authenticateToken, getOrderPayments);
router.put("/:paymentId", authenticateToken, updatePayment);
export default router;
