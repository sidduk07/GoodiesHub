import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc } from "drizzle-orm";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "@shared/schema";
import type { User, InsertUser, SwagItem, InsertSwag, UpdateSwag, SwagStatus } from "@shared/schema";
import { randomUUID } from "crypto";

// ============================================
// DATABASE CONNECTION
// ============================================
const DATABASE_URL = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let pool: InstanceType<typeof Pool> | null = null;

if (DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: DATABASE_URL });
    db = drizzle(pool, { schema });
    console.log("✅ Connected to PostgreSQL database");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
} else {
  console.log("⚠️  DATABASE_URL not set - using in-memory storage");
}

// ============================================
// STORAGE INTERFACE
// ============================================
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: string, emailNotifications: boolean): Promise<User | undefined>;
  getUsersWithEmailNotifications(): Promise<User[]>;

  getSwagItem(id: string): Promise<SwagItem | undefined>;
  getPublishedSwagItems(): Promise<SwagItem[]>;
  getSwagItemsByStatus(status: SwagStatus): Promise<SwagItem[]>;
  getSwagItemsByUser(userId: string): Promise<SwagItem[]>;
  getAllSwagItems(): Promise<SwagItem[]>;
  createSwagItem(swag: InsertSwag, userId: string): Promise<SwagItem>;
  updateSwagItem(id: string, updates: UpdateSwag): Promise<SwagItem | undefined>;
  approveSwagItem(id: string, adminId: string): Promise<SwagItem | undefined>;
  rejectSwagItem(id: string, reason: string): Promise<SwagItem | undefined>;
  deleteSwagItem(id: string): Promise<boolean>;
}

// ============================================
// POSTGRESQL STORAGE IMPLEMENTATION
// ============================================
class PostgresStorage implements IStorage {
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

  async createSwagItem(data: InsertSwag, userId: string): Promise<SwagItem> {
    if (!db) throw new Error("Database not available");
    const id = randomUUID();
    const now = new Date();
    const result = await db.insert(schema.swagItems).values({
      id,
      ...data,
      submittedBy: userId,
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
}

// ============================================
// EXPORT STORAGE INSTANCE
// ============================================
export const storage: IStorage = new PostgresStorage();
