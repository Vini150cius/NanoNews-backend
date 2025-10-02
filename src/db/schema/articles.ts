import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import { users } from "./users";

const bytea = customType<{
  data: Buffer;
  driverData: Buffer;
}>({
  dataType() {
    return "bytea";
  },
});

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  uuidAuthor: uuid("uuid_author").notNull().references(() => users.id, { onDelete: "cascade" }),
  headline: text("headline").notNull(),
  headerImage: bytea("header_image"), 
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
