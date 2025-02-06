import pool from "../config/database.js";

export const createReview = async (data) => {
  const { userId, productId, rating, comment } = data;

  try {
    const query = `
      INSERT INTO os_reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, productId, rating, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const getReviewsByProduct = async (productId) => {
  try {
    const reviews = await pool.query(
      `
        SELECT 
          r.id, r.rating, r.comment, r.created_at, r.user_id, u.username 
        FROM 
          os_reviews r
        INNER JOIN 
          os_users u ON r.user_id = u.id
        WHERE 
          r.product_id = $1
        ORDER BY 
          r.created_at DESC;
        `,
      [productId]
    );
    return reviews.rows;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw new Error("Failed to fetch reviews");
  }
};

export const getReviewsById = async (reviewId) => {
  const query = `SELECT * FROM os_reviews WHERE id = $1`;
  const values = [reviewId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw new Error("Unable to fetch review.");
  }
};

export const reviseReview = async (reviewId, data) => {
  const { rating, comment } = data;

  const query = `
      UPDATE os_reviews
      SET 
        rating = COALESCE($1, rating), 
        comment = COALESCE($2, comment), 
        created_at = NOW()
      WHERE id = $3
      RETURNING *`;
  const values = [rating, comment, reviewId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Unable to update review.");
  }
};

export const removeReview = async (reviewId) => {
  try {
    const query = "DELETE FROM os_reviews WHERE id = $1 RETURNING *";
    const values = [reviewId];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error("Review not found");
    }

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to remove review: ${error.message}`);
  }
};
