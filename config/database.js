import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

// Set up the database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render's managed PostgreSQL
  },
});

console.log("Connecting to:", process.env.DATABASE_URL);

db.connect()
  .then(() => console.log("Connected to the database successfully!"))
  .catch((err) => console.error("Database connection error:", err));

export default db;
