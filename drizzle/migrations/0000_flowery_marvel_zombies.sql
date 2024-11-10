CREATE TABLE IF NOT EXISTS "todos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT '2024-11-10 14:26:50.547' NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "todos_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"isSubscribed" boolean DEFAULT false NOT NULL,
	"subscriptionEnds" date,
	"createdAt" timestamp DEFAULT '2024-11-10 14:26:50.545' NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
