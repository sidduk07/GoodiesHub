import pkg from "pg";
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";
const pool = new Pool({ connectionString: DATABASE_URL });

async function testQuery() {
    console.log("🔍 Testing database queries...\n");

    const client = await pool.connect();

    try {
        // Direct query
        const { rows: items } = await client.query("SELECT id, title, status FROM swag_items LIMIT 5");
        console.log("📊 Direct SQL query result:");
        items.forEach(item => console.log(`  - ${item.title} [${item.status}]`));

        const { rows: countResult } = await client.query("SELECT COUNT(*) FROM swag_items");
        console.log(`\n📈 Total items: ${countResult[0].count}`);

        // Check users
        const { rows: users } = await client.query("SELECT id, email, role FROM users");
        console.log("\n👤 Users:");
        users.forEach(u => console.log(`  - ${u.email} (${u.role})`));

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

testQuery();
