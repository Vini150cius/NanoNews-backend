import { integer } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { articles } from "./articles";

export const content_of_article = pgTable("content_of_article", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  idArticle: uuid("id_article")
    .notNull()
    .references(() => articles.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  typeComponent: text("type_component").notNull(),
  content: text("content"),
});
