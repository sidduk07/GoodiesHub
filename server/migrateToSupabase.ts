/**
 * Supabase Migration Script
 * 
 * This script:
 * 1. Creates tables in Supabase
 * 2. Migrates all data from local PostgreSQL to Supabase
 * 
 * Usage:
 *   SUPABASE_URL="your-supabase-connection-string" npx tsx server/migrateToSupabase.ts
 */

import pkg from "pg";
const { Pool } = pkg;

// Source: Your local PostgreSQL
const LOCAL_DB = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";

// Destination: Supabase PostgreSQL
const SUPABASE_DB = process.env.SUPABASE_URL;

if (!SUPABASE_DB) {
    console.error("❌ Error: SUPABASE_URL environment variable is required");
    console.log("\nUsage:");
    console.log('  SUPABASE_URL="postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres" npx tsx server/migrateToSupabase.ts');
    process.exit(1);
}

const localPool = new Pool({ connectionString: LOCAL_DB });
const supabasePool = new Pool({ connectionString: SUPABASE_DB, ssl: { rejectUnauthorized: false } });

// SQL to create tables
const CREATE_TABLES_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  email_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Swag items table  
CREATE TABLE IF NOT EXISTS swag_items (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_swag_status ON swag_items(status);
CREATE INDEX IF NOT EXISTS idx_swag_category ON swag_items(category);
CREATE INDEX IF NOT EXISTS idx_swag_featured ON swag_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

async function migrateToSupabase() {
    console.log("🚀 Starting Supabase Migration\n");
    console.log("📍 Source: Local PostgreSQL");
    console.log("📍 Destination: Supabase\n");

    const localClient = await localPool.connect();
    const supabaseClient = await supabasePool.connect();

    try {
        // Step 1: Create tables in Supabase
        console.log("📦 Step 1: Creating tables in Supabase...");
        await supabaseClient.query(CREATE_TABLES_SQL);
        console.log("   ✅ Tables created\n");

        // Step 2: Migrate Users
        console.log("👤 Step 2: Migrating users...");
        const { rows: users } = await localClient.query("SELECT * FROM users");
        console.log(`   Found ${users.length} users`);

        for (const user of users) {
            try {
                await supabaseClient.query(`
          INSERT INTO users (id, username, email, password, role, email_notifications, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            username = EXCLUDED.username,
            email = EXCLUDED.email,
            password = EXCLUDED.password,
            role = EXCLUDED.role,
            email_notifications = EXCLUDED.email_notifications
        `, [
                    user.id,
                    user.username,
                    user.email,
                    user.password,
                    user.role,
                    user.email_notifications,
                    user.created_at
                ]);
            } catch (err: any) {
                console.log(`   ⚠️ Skipping duplicate user: ${user.email}`);
            }
        }
        console.log("   ✅ Users migrated\n");

        // Step 3: Migrate Swag Items
        console.log("🎁 Step 3: Migrating swag items...");
        const { rows: swagItems } = await localClient.query("SELECT * FROM swag_items");
        console.log(`   Found ${swagItems.length} swag items`);

        let migrated = 0;
        for (const item of swagItems) {
            try {
                await supabaseClient.query(`
          INSERT INTO swag_items (
            id, title, company, summary, content, hero_image, gallery_images,
            category, tags, eligibility, requirements, perks, faq,
            official_link, blog_url, video_url, status, rejection_reason,
            is_featured, submitted_by, approved_by, created_at, updated_at, published_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            company = EXCLUDED.company,
            summary = EXCLUDED.summary,
            content = EXCLUDED.content,
            hero_image = EXCLUDED.hero_image,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            status = EXCLUDED.status,
            is_featured = EXCLUDED.is_featured,
            updated_at = NOW()
        `, [
                    item.id,
                    item.title,
                    item.company,
                    item.summary,
                    item.content,
                    item.hero_image,
                    item.gallery_images,
                    item.category,
                    item.tags,
                    item.eligibility,
                    item.requirements,
                    item.perks,
                    item.faq,
                    item.official_link,
                    item.blog_url,
                    item.video_url,
                    item.status,
                    item.rejection_reason,
                    item.is_featured,
                    item.submitted_by,
                    item.approved_by,
                    item.created_at,
                    item.updated_at,
                    item.published_at
                ]);
                migrated++;
            } catch (err: any) {
                console.log(`   ⚠️ Error migrating "${item.title}": ${err.message}`);
            }
        }
        console.log(`   ✅ Migrated ${migrated}/${swagItems.length} swag items\n`);

        // Step 4: Verify migration
        console.log("🔍 Step 4: Verifying migration...");
        const { rows: [userCount] } = await supabaseClient.query("SELECT COUNT(*) FROM users");
        const { rows: [swagCount] } = await supabaseClient.query("SELECT COUNT(*) FROM swag_items");

        console.log(`   📊 Users in Supabase: ${userCount.count}`);
        console.log(`   📊 Swag items in Supabase: ${swagCount.count}\n`);

        console.log("═".repeat(50));
        console.log("🎉 MIGRATION COMPLETE!");
        console.log("═".repeat(50));
        console.log("\n📝 Next steps:");
        console.log("   1. Update your .env with SUPABASE_URL");
        console.log("   2. Deploy to Render");
        console.log("   3. Test your production app\n");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        localClient.release();
        supabaseClient.release();
        await localPool.end();
        await supabasePool.end();
    }
}

migrateToSupabase().catch(console.error);
