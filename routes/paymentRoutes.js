import express from "express";
import {
  initiatePayment,
  getPaymentDetails,
  updatePayment,
  getOrderPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/add", initiatePayment);
router.get("/:paymentId", getPaymentDetails);
router.get("/of-order/:orderId", getOrderPayments);
router.put("/:paymentId", updatePayment);
export default router;
