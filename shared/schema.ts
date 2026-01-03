import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(), // "user" | "admin"
  emailNotifications: boolean("email_notifications").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================
// SWAG ITEMS TABLE
// ============================================
export const swagStatusEnum = z.enum(["pending", "published", "rejected"]);
export type SwagStatus = z.infer<typeof swagStatusEnum>;

export const swagCategoryEnum = z.enum([
  "Hackathon",
  "Internship", 
  "Open Source",
  "Conference",
  "Program"
]);
export type SwagCategory = z.infer<typeof swagCategoryEnum>;

export const swagItems = pgTable("swag_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic info
  title: text("title").notNull(),
  company: text("company").notNull(),
  summary: text("summary").notNull(), // Short description for cards
  content: text("content").notNull(), // Rich text HTML content
  
  // Images
  heroImage: text("hero_image"), // URL/path to hero image
  galleryImages: text("gallery_images"), // JSON array of image URLs
  
  // Classification
  category: text("category").notNull(), // Hackathon, Internship, etc.
  tags: text("tags").notNull(), // JSON array of tags
  
  // Structured content sections
  eligibility: text("eligibility"), // Eligibility requirements text
  requirements: text("requirements"), // JSON array of how-to-earn steps
  perks: text("perks"), // JSON array of perks/goodies
  faq: text("faq"), // JSON array of FAQ items {question, answer}
  
  // External links
  officialLink: text("official_link"),
  blogUrl: text("blog_url"),
  videoUrl: text("video_url"),
  
  // Workflow status
  status: text("status").default("pending").notNull(), // pending | published | rejected
  rejectionReason: text("rejection_reason"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  
  // Relationships
  submittedBy: varchar("submitted_by", { length: 36 }),
  approvedBy: varchar("approved_by", { length: 36 }),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

// Validation schemas
export const insertSwagSchema = createInsertSchema(swagItems).omit({
  id: true,
  status: true,
  rejectionReason: true,
  approvedBy: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const updateSwagSchema = createInsertSchema(swagItems).omit({
  id: true,
  createdAt: true,
  submittedBy: true,
}).partial();

export type InsertSwag = z.infer<typeof insertSwagSchema>;
export type UpdateSwag = z.infer<typeof updateSwagSchema>;
export type SwagItem = typeof swagItems.$inferSelect;

// ============================================
// HELPER TYPES FOR JSON FIELDS
// ============================================
export interface FaqItem {
  question: string;
  answer: string;
}

export interface PerkItem {
  icon?: string;
  title: string;
  description?: string;
}

export interface RequirementStep {
  step: number;
  title: string;
  description?: string;
}
