import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";

// Check for database URL
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/goodieshub";

// Create database connection
function createDb() {
    try {
        const pool = new Pool({
            connectionString: DATABASE_URL,
        });

        const db = drizzle(pool, { schema });
        console.log("✅ Connected to PostgreSQL database");
        return db;
    } catch (error) {
        console.error("❌ Failed to connect to database:", error);
        console.log("⚠️  Falling back to in-memory storage");
        return null;
    }
}

export const db = createDb();
export type Database = typeof db;

// Re-export schema for convenience
export { schema };
