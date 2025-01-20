import pool from "../config/database.js";

export const createProduct = async (data) => {
    try{
    const query = `
        INSERT INTO os_products (name, description, price, stock, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        data.name,
        data.description || null,
        data.price,
        data.stock,
        data.image_url || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
} catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Unable to create product. Please try again later.");
  }
};

export const getProductById = async (id) => {
    const result = await pool.query("SELECT * FROM os_products WHERE id = $1", [id]);
    return result.rows[0];
  };


  
export const getAllProducts = async (filter = {}) =>  {
    const { category, priceMin, priceMax } = filter;
  
    const queryParts = [];
    const values = [];
    let queryIndex = 1;
  
    // Base query
    let query = `SELECT * FROM os_products`;
  
    // Add filters dynamically
    if (category) {
      queryParts.push(`category = $${queryIndex++}`);
      values.push(category);
    }
  
    if (priceMin !== undefined) {
      queryParts.push(`price >= $${queryIndex++}`);
      values.push(priceMin);
    }
  
    if (priceMax !== undefined) {
      queryParts.push(`price <= $${queryIndex++}`);
      values.push(priceMax);
    }
  
    if (queryParts.length > 0) {
      query += ` WHERE ` + queryParts.join(' AND ');
    }
  
    query += ` ORDER BY created_at DESC`;
  
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to retrieve products');
    }
  }
  
  export const reviseProduct = async (productId, data) => {
    const { name, description, price, stock, image_url } = data;

    if (!productId || Object.keys(data).length === 0) {
        throw new Error("Product ID and at least one field to update are required.");
    }

    const query = `
        UPDATE os_products
        SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            stock = COALESCE($4, stock),
            image_url = COALESCE($5, image_url),
            created_at = created_at
        WHERE id = $6
        RETURNING *;
    `;

    const values = [name, description, price, stock, image_url, productId];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Product not found or no fields updated.");
        }
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error updating product: ${error.message}`);
    }
}

export const removeProduct = async (productId) => {
    const query = "DELETE FROM os_products WHERE id = $1 RETURNING *";
  
    try {
      // Execute the delete query
      const result = await pool.query(query, [productId]);
  
      // Check if the product existed
      if (result.rowCount === 0) {
        throw new Error(`Product with ID ${productId} not found`);
      }
    } catch (error) {
      // Re-throw the error for the controller to handle
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  };