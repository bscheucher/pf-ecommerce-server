import pool from "../config/database.js";


export const createOrder = async(data) => {
    const { userId, items, address, paymentMethod } = data;

    // Validate input
    if (!userId || !items || items.length === 0) {
        throw new Error('Invalid order data: Missing userId or items.');
    }

    // Calculate total amount and check stock
    let totalAmount = 0;
    const queries = [];

    for (const item of items) {
        const { productId, quantity } = item;

        const product = await pool.query('SELECT stock, price FROM os_products WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            throw new Error(`Product with ID ${productId} not found.`);
        }

        const { stock, price } = product.rows[0];
        if (stock < quantity) {
            throw new Error(`Insufficient stock for product ID ${productId}.`);
        }

        totalAmount += price * quantity;

        // Reduce stock in product table
        queries.push(pool.query('UPDATE os_products SET stock = stock - $1 WHERE id = $2', [quantity, productId]));
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
        const product = await pool.query('SELECT price FROM os_products WHERE id = $1', [productId]);
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

    // Insert address if provided
    if (address) {
        const { fullName, streetAddress, city, state, postalCode, country, phoneNumber } = address;
        queries.push(
            pool.query(
                `INSERT INTO os_addresses (user_id, full_name, street_address, city, state, postal_code, country, phone_number)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [userId, fullName, streetAddress, city, state, postalCode, country, phoneNumber]
            )
        );
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
}


