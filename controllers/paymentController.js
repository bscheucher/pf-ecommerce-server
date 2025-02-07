import {
  createPayment,
  getPaymentById,
  getPaymentsByOrder,
  updatePaymentStatus,
} from "../services/paymentService.js";

export const initiatePayment = async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  if (!orderId || !paymentMethod) {
    return res
      .status(400)
      .json({ message: "Order ID and payment method are required" });
  }

  try {
    const payment = await createPayment({ orderId, paymentMethod });
    res.status(201).json({
      message: "Payment initiated successfully",
      payment,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const paymentDetails = await getPaymentById(paymentId);

    res.status(200).json({
      success: true,
      data: paymentDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updatePayment = async (req, res) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  if (!paymentId || !status) {
    return res
      .status(400)
      .json({ error: "Payment ID and status are required" });
  }

  try {
    const updatedPayment = await updatePaymentStatus(paymentId, status);
    return res.status(200).json({
      message: "Payment status updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error in controller:", error.message);
    return res.status(500).json({ error: "Failed to update payment status" });
  }
};

export const getOrderPayments = async (req, res) => {
  const { orderId } = req.params;

  try {
    const payments = await getPaymentsByOrder(orderId);
    console.log("Payments for order:", JSON.stringify(payments, null, 2));

    if (payments.length === 0) {
      return res.status(200).json({ payments: [] });
    }

    return res.status(200).json({ payments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching payments: " + error.message });
  }
};
