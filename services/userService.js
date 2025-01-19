import pool from "../config/database.js";
import bcrypt from "bcrypt";

export const createUser = async (
  username,
  email,
  password,
  isAdmin = false
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed pw in createUser", hashedPassword);
    const result = await pool.query(
      `INSERT INTO os_users (username, email, password_hash, is_admin) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, username, email, is_admin, created_at`,
      [username, email, hashedPassword, isAdmin]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user. Please try again later.");
  }
};

export const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM os_users WHERE id = $1", [id]);
  return result.rows[0];
};

export const editUser = async (id, updates) => {
  const fields = [];
  const values = [];
  let query = "UPDATE os_users SET ";
  console.log("Updates in service:", updates);
  if (updates.username) {
    fields.push(`username = $${fields.length + 1}`);
    values.push(updates.username);
  }

  if (updates.email) {
    fields.push(`email = $${fields.length + 1}`);
    values.push(updates.email);
  }

  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    fields.push(`password_hash = $${fields.length + 1}`);
    values.push(hashedPassword);
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update.");
  }

  query += fields.join(", ");
  query += ` WHERE id = $${fields.length + 1} RETURNING *`;
  values.push(id);
  console.log("Query in service:", query);
  console.log("Values in service:", values);
  const result = await pool.query(query, values);
  return result.rows[0];
};
