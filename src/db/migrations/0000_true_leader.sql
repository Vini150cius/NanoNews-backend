CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uuid_author" uuid NOT NULL,
	"headline" text NOT NULL,
	"header_image" "bytea",
	"tags" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "content_of_article" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_article" uuid NOT NULL,
	"order" integer NOT NULL,
	"type_component" text NOT NULL,
	"content" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"profile_picture" text DEFAULT 'https://i.ibb.co/4pDNDk1/avatar.png',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_uuid_author_users_id_fk" FOREIGN KEY ("uuid_author") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_of_article" ADD CONSTRAINT "content_of_article_id_article_articles_id_fk" FOREIGN KEY ("id_article") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;