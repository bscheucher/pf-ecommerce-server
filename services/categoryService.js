import pool from "../config/database.js";

export const createCategory = async (name, description) => {
  const query = `
          INSERT INTO os_categories (name, description)
          VALUES ($1, $2)
          RETURNING *;
      `;
  const values = [name, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllCategories = async () => {
  const query = `
    SELECT * FROM os_categories;
    `;

  const result = await pool.query(query);
  return result.rows;
};

export const getCategoryById = async (id) => {
  const query = `
          SELECT * FROM os_categories
          WHERE id = $1;
      `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const reviseCategory = async (categoryId, data) => {
  const { name, description } = data;

  if (!categoryId || Object.keys(data).length === 0) {
    throw new Error(
      "Category ID and at least one field to update are required."
    );
  }

  const query = `
        UPDATE os_categories
        SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description)           
        WHERE id = $3
        RETURNING *;
    `;

  const values = [name, description, categoryId];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Category not found or no fields updated.");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating category: ${error.message}`);
  }
};

export const removeCategory = async (categoryId) => {
  const query = "DELETE FROM os_categories WHERE id = $1 RETURNING *";

  try {
    // Execute the delete query
    const result = await pool.query(query, [categoryId]);

    // Check if the category existed
    if (result.rowCount === 0) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
  } catch (error) {
    // Re-throw the error for the controller to handle
    throw new Error(`Failed to delete category: ${error.message}`);
  }
};
