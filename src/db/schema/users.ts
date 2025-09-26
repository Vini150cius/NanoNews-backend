import { timestamp, text, pgTable, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  profilePicture: text().default("https://i.ibb.co/4pDNDk1/avatar.png"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
