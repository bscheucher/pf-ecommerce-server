import pool from "../config/database.js";

export const createAddress = async (data) => {
  const query = `
        INSERT INTO os_addresses (
            user_id, full_name, street_address, city, state, postal_code, country, phone_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

  const values = [
    data.userId,
    data.fullName,
    data.streetAddress,
    data.city,
    data.state || null,
    data.postalCode || null,
    data.country,
    data.phoneNumber || null,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating address:", error);
    throw new Error("Could not create address");
  }
};

export const getAddressesByUser = async (userId) => {
  try {
    const query = `
            SELECT id, full_name, street_address, city, state, postal_code, country, phone_number
            FROM os_addresses
            WHERE user_id = $1
        `;
    const result = await pool.query(query, [userId]);
    return result.rows; // Returns an array of address objects
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    throw new Error("Unable to fetch addresses at this time");
  }
};

export const getAddressById = async (addressId) => {
  try {
    const query = `SELECT * FROM os_addresses WHERE id = $1`;
    const values = [addressId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Address not found");
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error in getAddressById: ${error.message}`);
    throw error;
  }
};

export const reviseAddress = async (addressId, data) => {
  try {
    const { rows } = await pool.query(
      `
          UPDATE os_addresses
          SET 
              full_name = COALESCE($1, full_name),
              street_address = COALESCE($2, street_address),
              city = COALESCE($3, city),
              state = COALESCE($4, state),
              postal_code = COALESCE($5, postal_code),
              country = COALESCE($6, country),
              phone_number = COALESCE($7, phone_number)
          WHERE id = $8
          RETURNING *;
          `,
      [
        data.full_name,
        data.street_address,
        data.city,
        data.state,
        data.postal_code,
        data.country,
        data.phone_number,
        addressId,
      ]
    );

    if (rows.length === 0) {
      throw new Error(`Address with ID ${addressId} not found.`);
    }

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to update address: ${error.message}`);
  }
};

export const removeAddress = async (addressId) => {
  try {
    const result = await pool.query(
      "DELETE FROM os_addresses WHERE id = $1 RETURNING *",
      [addressId]
    );
    if (result.rowCount === 0) {
      throw new Error("Address not found");
    }
    return result.rows[0]; // Return the deleted address (optional)
  } catch (error) {
    throw new Error(`Error removing address: ${error.message}`);
  }
};
