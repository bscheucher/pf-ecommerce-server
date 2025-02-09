import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from "../services/orderService.js";

export const listOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const placeOrder = async (req, res) => {
  console.log("Received request body:", req.body); // Debugging line
  try {
    console.log("Current user:", req.user);

    const { userId, items, addressId, address, paymentMethod } = req.body;
    console.log("Order Data Received:", {
      userId,
      items,
      addressId,
      address,
      paymentMethod,
    });

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must include items." });
    }

    // Create order
    const order = await createOrder({
      userId,
      items,
      addressId,
      address,
      paymentMethod,
    });

    console.log("Created Order:", order); // Debugging

    if (!order) {
      return res.status(500).json({ error: "Order creation failed." });
    }

    // Return 201 status with the created order
    res.status(201).json({
      message: "Order placed successfully.",
      order: order, // Returning the order object
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ error: "Failed to place order. Please try again later." });
  }
};

export const getOrder = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing order ID" });
  }

  try {
    const order = await getOrderById(Number(id));
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const listUserOrders = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const orders = await getOrdersByUser(userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error listing user orders:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve orders. Please try again later." });
  }
};

export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  try {
    const updatedOrder = await updateOrderStatus(orderId, status);
    return res
      .status(200)
      .json({ message: "Order status updated.", order: updatedOrder });
  } catch (error) {
    console.error(`Error in updateOrder: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  try {
    const result = await deleteOrder(orderId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in cancelOrder controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
