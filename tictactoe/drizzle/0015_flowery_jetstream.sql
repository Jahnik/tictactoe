ALTER TABLE "games" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_name_unique" UNIQUE("name");