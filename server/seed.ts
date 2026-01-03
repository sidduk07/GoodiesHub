import pkg from "pg";
const { Pool } = pkg;
import { randomUUID, scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/goodieshub";

const pool = new Pool({ connectionString: DATABASE_URL });

async function seed() {
    console.log("🌱 Seeding database...");
    console.log(`   Using: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

    const client = await pool.connect();

    try {
        // Check if admin already exists
        const { rows: existingUsers } = await client.query("SELECT id FROM users LIMIT 1");
        if (existingUsers.length > 0) {
            console.log("📦 Database already has data. Skipping seed.");
            return;
        }

        // Create admin user
        const adminPassword = "admin123";
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(adminPassword, salt, 64)) as Buffer;
        const hashedPassword = `${buf.toString("hex")}.${salt}`;

        await client.query(`
      INSERT INTO users (id, username, email, password, role, email_notifications)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['admin-001', 'admin', 'admin@goodieshub.com', hashedPassword, 'admin', true]);

        console.log("✅ Created admin user");

        // Seed swag items
        const items = [
            {
                id: randomUUID(),
                title: "Hacktoberfest 2025 Kit",
                company: "DigitalOcean",
                summary: "Complete 4 pull requests to earn a limited edition t-shirt or plant a tree.",
                content: "Complete 4 pull requests to open source repos during October.",
                hero_image: "/attached_assets/stock_images/developer_t-shirt_b2f7cffb.jpg",
                category: "Open Source",
                tags: JSON.stringify(["T-Shirt", "Stickers", "Global"]),
                eligibility: "Open to everyone with a GitHub account.",
                requirements: JSON.stringify([{ step: 1, title: "Register" }, { step: 2, title: "4 PRs merged" }]),
                perks: JSON.stringify([{ icon: "👕", title: "T-Shirt" }]),
                official_link: "https://hacktoberfest.com",
                is_featured: true,
            },
            {
                id: randomUUID(),
                title: "Microsoft Learn Student Ambassadors",
                company: "Microsoft",
                summary: "Get a welcome kit including polo shirt, certificate, and LinkedIn Premium.",
                content: "Join a global community of student leaders passionate about technology.",
                hero_image: "/attached_assets/stock_images/tech_backpack_cf11bd3b.jpg",
                category: "Program",
                tags: JSON.stringify(["Kit", "Certificate", "Microsoft"]),
                eligibility: "Must be enrolled in an accredited institution. Age 16+.",
                requirements: JSON.stringify([{ step: 1, title: "Apply online" }, { step: 2, title: "Submit video" }]),
                perks: JSON.stringify([{ icon: "👔", title: "Polo Shirt" }, { icon: "🎒", title: "Backpack" }]),
                official_link: "https://studentambassadors.microsoft.com",
                video_url: "https://youtu.be/G2-RFt7M2Bo?si=ri_E451hsA6pfgSM",
                is_featured: true,
            },
            {
                id: randomUUID(),
                title: "GitHub Student Developer Pack",
                company: "GitHub",
                summary: "Free developer tools for students - Copilot, Canva Pro, domains, and more.",
                content: "Access premium tools including GitHub Copilot, Canva Pro, and cloud credits.",
                hero_image: "/attached_assets/stock_images/laptop_stickers_deve_80ac774e.jpg",
                category: "Program",
                tags: JSON.stringify(["Software", "Free Tools"]),
                eligibility: "Must be 13+ and enrolled in a degree-granting course.",
                requirements: JSON.stringify([{ step: 1, title: "Verify student status" }]),
                perks: JSON.stringify([{ icon: "🤖", title: "GitHub Copilot" }, { icon: "🎨", title: "Canva Pro" }]),
                official_link: "https://education.github.com/pack",
                is_featured: false,
            }
        ];

        for (const item of items) {
            await client.query(`
        INSERT INTO swag_items (
          id, title, company, summary, content, hero_image, category, tags,
          eligibility, requirements, perks, official_link, video_url,
          status, is_featured, submitted_by, approved_by, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'published', $14, 'admin-001', 'admin-001', NOW())
      `, [
                item.id, item.title, item.company, item.summary, item.content,
                item.hero_image, item.category, item.tags, item.eligibility,
                item.requirements, item.perks, item.official_link, item.video_url || null,
                item.is_featured
            ]);
        }

        console.log(`✅ Created ${items.length} swag items`);
        console.log("");
        console.log("🎉 Database seeded successfully!");
        console.log("");
        console.log("Admin credentials:");
        console.log("  Email: admin@goodieshub.com");
        console.log("  Password: admin123");

    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
