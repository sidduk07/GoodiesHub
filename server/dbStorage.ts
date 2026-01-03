import { db, schema } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID, scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import type { User, InsertUser, SwagItem, InsertSwag, UpdateSwag, SwagStatus } from "@shared/schema";

const scryptAsync = promisify(scrypt);

/**
 * Database Storage Implementation
 * Uses Drizzle ORM with PostgreSQL (Neon)
 */
export class DatabaseStorage {
    // ============================================
    // USER OPERATIONS
    // ============================================
    async getUser(id: string): Promise<User | undefined> {
        if (!db) return undefined;
        const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
        return result[0];
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        if (!db) return undefined;
        const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        return result[0];
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        if (!db) return undefined;
        const result = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
        return result[0];
    }

    async createUser(data: InsertUser): Promise<User> {
        if (!db) throw new Error("Database not available");
        const id = randomUUID();
        const result = await db.insert(schema.users).values({
            id,
            ...data,
            role: "user",
            emailNotifications: false,
        }).returning();
        return result[0];
    }

    async updateUserPreferences(id: string, emailNotifications: boolean): Promise<User | undefined> {
        if (!db) return undefined;
        const result = await db.update(schema.users)
            .set({ emailNotifications })
            .where(eq(schema.users.id, id))
            .returning();
        return result[0];
    }

    async getUsersWithEmailNotifications(): Promise<User[]> {
        if (!db) return [];
        return db.select().from(schema.users).where(eq(schema.users.emailNotifications, true));
    }

    // ============================================
    // SWAG ITEM OPERATIONS
    // ============================================
    async getAllSwagItems(): Promise<SwagItem[]> {
        if (!db) return [];
        return db.select().from(schema.swagItems).orderBy(desc(schema.swagItems.createdAt));
    }

    async getPublishedSwagItems(): Promise<SwagItem[]> {
        if (!db) return [];
        return db.select().from(schema.swagItems)
            .where(eq(schema.swagItems.status, "published"))
            .orderBy(desc(schema.swagItems.publishedAt));
    }

    async getSwagItemsByStatus(status: SwagStatus): Promise<SwagItem[]> {
        if (!db) return [];
        return db.select().from(schema.swagItems)
            .where(eq(schema.swagItems.status, status))
            .orderBy(desc(schema.swagItems.createdAt));
    }

    async getSwagItemsByUser(userId: string): Promise<SwagItem[]> {
        if (!db) return [];
        return db.select().from(schema.swagItems)
            .where(eq(schema.swagItems.submittedBy, userId))
            .orderBy(desc(schema.swagItems.createdAt));
    }

    async getSwagItem(id: string): Promise<SwagItem | undefined> {
        if (!db) return undefined;
        const result = await db.select().from(schema.swagItems).where(eq(schema.swagItems.id, id)).limit(1);
        return result[0];
    }

    async createSwagItem(data: InsertSwag): Promise<SwagItem> {
        if (!db) throw new Error("Database not available");
        const id = randomUUID();
        const now = new Date();
        const result = await db.insert(schema.swagItems).values({
            id,
            ...data,
            status: "pending",
            isFeatured: false,
            createdAt: now,
            updatedAt: now,
        }).returning();
        return result[0];
    }

    async updateSwagItem(id: string, data: UpdateSwag): Promise<SwagItem | undefined> {
        if (!db) return undefined;
        const result = await db.update(schema.swagItems)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(schema.swagItems.id, id))
            .returning();
        return result[0];
    }

    async approveSwagItem(id: string, adminId: string): Promise<SwagItem | undefined> {
        if (!db) return undefined;
        const now = new Date();
        const result = await db.update(schema.swagItems)
            .set({
                status: "published",
                approvedBy: adminId,
                publishedAt: now,
                updatedAt: now,
            })
            .where(eq(schema.swagItems.id, id))
            .returning();
        return result[0];
    }

    async rejectSwagItem(id: string, reason: string): Promise<SwagItem | undefined> {
        if (!db) return undefined;
        const result = await db.update(schema.swagItems)
            .set({
                status: "rejected",
                rejectionReason: reason,
                updatedAt: new Date(),
            })
            .where(eq(schema.swagItems.id, id))
            .returning();
        return result[0];
    }

    async deleteSwagItem(id: string): Promise<boolean> {
        if (!db) return false;
        const result = await db.delete(schema.swagItems).where(eq(schema.swagItems.id, id)).returning();
        return result.length > 0;
    }

    // ============================================
    // SEED DATA FOR FRESH DATABASE
    // ============================================
    async seedIfEmpty(): Promise<void> {
        if (!db) return;

        // Check if users exist
        const existingUsers = await db.select().from(schema.users).limit(1);
        if (existingUsers.length > 0) {
            console.log("📦 Database already has data, skipping seed");
            return;
        }

        console.log("🌱 Seeding database with initial data...");

        // Create admin user
        const adminPassword = "admin123";
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(adminPassword, salt, 64)) as Buffer;
        const hashedPassword = `${buf.toString("hex")}.${salt}`;

        await db.insert(schema.users).values({
            id: "admin-001",
            username: "admin",
            email: "admin@goodieshub.com",
            password: hashedPassword,
            role: "admin",
            emailNotifications: true,
        });

        // Seed with sample swag items
        const sampleItems = [
            {
                id: randomUUID(),
                title: "Hacktoberfest 2025 Kit",
                company: "DigitalOcean",
                summary: "Complete 4 pull requests to open source repositories during October to earn a limited edition t-shirt or plant a tree.",
                content: "Complete 4 pull requests to open source repositories during October to earn a limited edition t-shirt or plant a tree. This annual event encourages participation in the open source community.",
                heroImage: "/attached_assets/stock_images/developer_t-shirt_b2f7cffb.jpg",
                category: "Open Source",
                tags: JSON.stringify(["T-Shirt", "Stickers", "Global", "Seasonal"]),
                eligibility: "Open to everyone worldwide. Must have a GitHub account.",
                requirements: JSON.stringify([
                    { step: 1, title: "Register on official site" },
                    { step: 2, title: "4 PRs merged in October" },
                    { step: 3, title: "Follow participation rules" }
                ]),
                perks: JSON.stringify([
                    { icon: "👕", title: "Limited Edition T-Shirt" },
                    { icon: "🌳", title: "Tree Planted" },
                    { icon: "🏆", title: "Digital Badge" }
                ]),
                faq: JSON.stringify([
                    { question: "Is this program free?", answer: "Yes, completely free to participate!" }
                ]),
                officialLink: "https://hacktoberfest.com",
                status: "published",
                isFeatured: true,
                submittedBy: "admin-001",
                approvedBy: "admin-001",
                publishedAt: new Date(),
            },
            {
                id: randomUUID(),
                title: "Microsoft Learn Student Ambassadors",
                company: "Microsoft",
                summary: "Become a student ambassador to lead a community and get a welcome kit including polo shirt, certificate, LinkedIn Premium, and more.",
                content: "The Microsoft Learn Student Ambassadors program is a global community of student leaders passionate about technology. Get exclusive swag, Azure credits, and LinkedIn Premium.",
                heroImage: "/attached_assets/stock_images/tech_backpack_cf11bd3b.jpg",
                category: "Program",
                tags: JSON.stringify(["Kit", "Certificate", "Software", "Community", "Microsoft"]),
                eligibility: "Must be enrolled in an accredited academic institution. Age 16+.",
                requirements: JSON.stringify([
                    { step: 1, title: "Apply online" },
                    { step: 2, title: "Record submission video" },
                    { step: 3, title: "Host events quarterly" }
                ]),
                perks: JSON.stringify([
                    { icon: "👔", title: "Polo Shirt" },
                    { icon: "🎒", title: "Backpack" },
                    { icon: "💼", title: "LinkedIn Premium" }
                ]),
                officialLink: "https://studentambassadors.microsoft.com",
                videoUrl: "https://youtu.be/G2-RFt7M2Bo?si=ri_E451hsA6pfgSM",
                status: "published",
                isFeatured: true,
                submittedBy: "admin-001",
                approvedBy: "admin-001",
                publishedAt: new Date(),
            },
            {
                id: randomUUID(),
                title: "GitHub Student Developer Pack",
                company: "GitHub",
                summary: "The best free developer tools for students. Get GitHub Copilot, Canva Pro, free domains, JetBrains IDEs and cloud credits.",
                content: "Get free access to premium developer tools including GitHub Copilot, Canva Pro, domains, and cloud credits. Perfect for student projects.",
                heroImage: "/attached_assets/stock_images/laptop_stickers_deve_80ac774e.jpg",
                category: "Program",
                tags: JSON.stringify(["Software", "Free Tools", "Students"]),
                eligibility: "Must be 13+ and enrolled in degree-granting course.",
                requirements: JSON.stringify([
                    { step: 1, title: "Verify student status" },
                    { step: 2, title: "Apply with school email" }
                ]),
                perks: JSON.stringify([
                    { icon: "🤖", title: "GitHub Copilot" },
                    { icon: "🎨", title: "Canva Pro" },
                    { icon: "💻", title: "JetBrains IDEs" }
                ]),
                officialLink: "https://education.github.com/pack",
                status: "published",
                isFeatured: false,
                submittedBy: "admin-001",
                approvedBy: "admin-001",
                publishedAt: new Date(),
            }
        ];

        for (const item of sampleItems) {
            await db.insert(schema.swagItems).values(item as any);
        }

        console.log("✅ Database seeded with admin user and sample swag items");
    }
}

export const dbStorage = new DatabaseStorage();
