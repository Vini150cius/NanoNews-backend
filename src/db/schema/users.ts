import { timestamp, text, pgTable, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture").default(
    "https://i.ibb.co/4pDNDk1/avatar.png"
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
