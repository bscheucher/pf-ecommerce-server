import {createOrder} from "../services/orderService.js"



export const placeOrder = async (req, res) =>  {
    try {
        const userId = req.user.id; 
        const { items, address, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must include items.' });
        }

        const orderId = await createOrder({ userId, items, address, paymentMethod });

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).json({ error: 'Failed to place order. Please try again later.' });
    }
}


