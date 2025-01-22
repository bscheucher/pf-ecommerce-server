import pool from "../config/database.js";
import crypto from "crypto";

export const createPayment = async (data) => {
  const { orderId, paymentMethod } = data;

  // Generate a unique transaction ID
  const transactionId = crypto.randomUUID();

  try {
    const result = await pool.query(
      `INSERT INTO os_payments (order_id, payment_method, payment_status, transaction_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
      [orderId, paymentMethod, "Pending", transactionId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Could not create payment");
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const query = `
        SELECT 
          os_payments.id,
          os_payments.payment_method,
          os_payments.payment_status,
          os_payments.transaction_id,
          os_payments.created_at,
          os_orders.id AS order_id,
          os_orders.total_amount,
          os_orders.status AS order_status,
          os_users.username AS user
        FROM os_payments
        JOIN os_orders ON os_payments.order_id = os_orders.id
        JOIN os_users ON os_orders.user_id = os_users.id
        WHERE os_payments.id = $1;
      `;
    const { rows } = await pool.query(query, [paymentId]);

    if (rows.length === 0) {
      throw new Error("Payment not found");
    }

    return rows[0];
  } catch (error) {
    throw new Error(`Error fetching payment details: ${error.message}`);
  }
};

export const updatePaymentStatus = async (paymentId, status) => {
  try {
    const query = `
        UPDATE os_payments
        SET payment_status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *;
      `;
    const values = [status, paymentId];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      throw new Error("Payment not found");
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating payment status:", error.message);
    throw new Error("Database error while updating payment status");
  }
};
export const getPaymentsByOrder = async (orderId) => {
  try {
    const query = `
        SELECT os_payments.* 
        FROM os_orders 
        JOIN os_payments ON os_orders.id = os_payments.order_id 
        WHERE os_orders.id = $1
      `;
    const { rows } = await pool.query(query, [orderId]); 

    return rows; 
  } catch (error) {
    throw new Error("Error fetching payments: " + error.message);
  }
};
