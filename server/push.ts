import pkg from "pg";
const { Pool } = pkg;
import { randomUUID, scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/goodieshub";

const pool = new Pool({ connectionString: DATABASE_URL });

async function push() {
  console.log("🚀 Pushing schema to database...");
  console.log(`   Using: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

  const client = await pool.connect();

  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        email_notifications BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    console.log("✅ Created table: users");

    // Create swag_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS swag_items (
        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        hero_image TEXT,
        gallery_images TEXT,
        category TEXT NOT NULL,
        tags TEXT NOT NULL,
        eligibility TEXT,
        requirements TEXT,
        perks TEXT,
        faq TEXT,
        official_link TEXT,
        blog_url TEXT,
        video_url TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        rejection_reason TEXT,
        is_featured BOOLEAN NOT NULL DEFAULT false,
        submitted_by VARCHAR(36),
        approved_by VARCHAR(36),
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        published_at TIMESTAMP
      )
    `);
    console.log("✅ Created table: swag_items");

    console.log("");
    console.log("🎉 Schema pushed successfully!");

  } catch (error) {
    console.error("❌ Failed to push schema:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

push();
