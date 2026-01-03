import pkg from "pg";
const { Pool } = pkg;
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";
const pool = new Pool({ connectionString: DATABASE_URL });

async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function fixAdminPassword() {
    console.log("🔐 Fixing admin password...\n");

    const client = await pool.connect();

    try {
        // Hash the password properly
        const hashedPassword = await hashPassword("admin123");

        // Update admin user
        const result = await client.query(
            "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
            [hashedPassword, "admin@goodieshub.com"]
        );

        if (result.rowCount && result.rowCount > 0) {
            console.log("✅ Admin password updated!");
            console.log("\n📧 Email: admin@goodieshub.com");
            console.log("🔑 Password: admin123");
        } else {
            // Create admin if doesn't exist
            console.log("Admin user not found, creating new admin...");
            await client.query(`
        INSERT INTO users (id, username, email, password, role, email_notifications)
        VALUES ('admin-001', 'admin', 'admin@goodieshub.com', $1, 'admin', true)
      `, [hashedPassword]);
            console.log("✅ Admin user created!");
            console.log("\n📧 Email: admin@goodieshub.com");
            console.log("🔑 Password: admin123");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

fixAdminPassword();
