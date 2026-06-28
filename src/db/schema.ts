import {
  pgTable,
  text,
  integer,
  real,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  image: text("image"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const designs = pgTable("designs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull().default("Untitled Design"),
  canvasJSON: text("canvas_json").notNull().default("{}"),
  width: integer("width").notNull().default(1920),
  height: integer("height").notNull().default(1080),
  thumbnail: text("thumbnail"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  canvasJSON: text("canvas_json").notNull(),
  width: integer("width").notNull().default(1920),
  height: integer("height").notNull().default(1080),
  thumbnail: text("thumbnail"),
});
