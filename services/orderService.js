import pool from "../config/database.js";

export const createOrder = async (data) => {
  const { userId, items, addressId, address, paymentMethod } = data;

  if (!userId || !items || items.length === 0) {
    throw new Error("Invalid order data: Missing userId or items.");
  }

  let totalAmount = 0;
  const queries = [];

  for (const item of items) {
    const { productId, quantity } = item;

    const product = await pool.query(
      "SELECT stock, price FROM os_products WHERE id = $1",
      [productId]
    );
    if (product.rows.length === 0) {
      throw new Error(`Product with ID ${productId} not found.`);
    }

    const { stock, price } = product.rows[0];
    if (stock < quantity) {
      throw new Error(`Insufficient stock for product ID ${productId}.`);
    }

    totalAmount += price * quantity;

    queries.push(
      pool.query("UPDATE os_products SET stock = stock - $1 WHERE id = $2", [
        quantity,
        productId,
      ])
    );
  }

  // Insert order into os_orders
  const orderResult = await pool.query(
    `INSERT INTO os_orders (user_id, total_amount, status) 
         VALUES ($1, $2, 'Pending') RETURNING id`,
    [userId, totalAmount]
  );
  const orderId = orderResult.rows[0].id;

  // Insert order items
  for (const item of items) {
    const { productId, quantity } = item;
    const product = await pool.query(
      "SELECT price FROM os_products WHERE id = $1",
      [productId]
    );
    const price = product.rows[0].price;
    const totalPrice = price * quantity;

    queries.push(
      pool.query(
        `INSERT INTO os_order_items (order_id, product_id, quantity, price, total_price)
                 VALUES ($1, $2, $3, $4, $5)`,
        [orderId, productId, quantity, price, totalPrice]
      )
    );
  }

  // Use existing addressId or insert a new address
  if (addressId) {
    const addressCheck = await pool.query(
      "SELECT id FROM os_addresses WHERE id = $1 AND user_id = $2",
      [addressId, userId]
    );
    if (addressCheck.rows.length === 0) {
      throw new Error(
        "Invalid addressId or address does not belong to the user."
      );
    }
  } else if (address) {
    const {
      fullName,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
    } = address;
    const addressResult = await pool.query(
      `INSERT INTO os_addresses (user_id, full_name, street_address, city, state, postal_code, country, phone_number)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        userId,
        fullName,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
      ]
    );
    data.addressId = addressResult.rows[0].id;
  } else {
    throw new Error("Address information is required.");
  }

  // Insert payment details
  queries.push(
    pool.query(
      `INSERT INTO os_payments (order_id, payment_method, payment_status)
             VALUES ($1, $2, 'Pending')`,
      [orderId, paymentMethod]
    )
  );

  // Execute all queries
  await Promise.all(queries);

  return orderId;
};

export const getOrderById = async (orderId) => {
  const orderQuery = `
        SELECT 
            o.id AS order_id,
            o.user_id,
            o.total_amount,
            o.status,
            o.created_at,
            o.updated_at,
            u.username AS user_name,
            u.email AS user_email
        FROM os_orders o
        JOIN os_users u ON o.user_id = u.id
        WHERE o.id = $1
    `;

  const itemsQuery = `
        SELECT 
            oi.id AS item_id,
            oi.quantity,
            oi.price,
            oi.total_price,
            p.id AS product_id,
            p.name AS product_name,
            p.description AS product_description,
            p.image_url AS product_image
        FROM os_order_items oi
        JOIN os_products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
    `;

  try {
    const orderResult = await pool.query(orderQuery, [orderId]);
    if (orderResult.rows.length === 0) {
      return null; // Order not found
    }

    const order = orderResult.rows[0];
    const itemsResult = await pool.query(itemsQuery, [orderId]);

    return {
      orderId: order.order_id,
      userId: order.user_id,
      userName: order.user_name,
      userEmail: order.user_email,
      totalAmount: order.total_amount,
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: itemsResult.rows,
    };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Database query failed");
  }
};

export const getOrdersByUser = async (userId) => {
  try {
    const orders = await pool.query(
      `
            SELECT 
                o.id AS order_id,
                o.total_amount,
                o.status,
                o.created_at,
                o.updated_at,
                ARRAY_AGG(
                    JSON_BUILD_OBJECT(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'total_price', oi.total_price,
                        'product_name', p.name
                    )
                ) AS items
            FROM os_orders o
            LEFT JOIN os_order_items oi ON o.id = oi.order_id
            LEFT JOIN os_products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
            `,
      [userId]
    );

    return orders.rows;
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw new Error("Could not retrieve user orders.");
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const result = await pool.query(
      `UPDATE os_orders 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING *`,
      [status, orderId]
    );

    if (result.rowCount === 0) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error updating order status: ${error.message}`);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const result = await pool.query(
      "DELETE FROM os_orders WHERE id = $1 RETURNING id",
      [orderId]
    );
    if (result.rowCount === 0) {
      throw new Error(`Order with ID ${orderId} does not exist.`);
    }
    return {
      success: true,
      message: `Order with ID ${orderId} has been deleted.`,
    };
  } catch (error) {
    console.error("Error deleting order:", error.message);
    throw new Error("Could not delete the order. Please try again later.");
  }
};
