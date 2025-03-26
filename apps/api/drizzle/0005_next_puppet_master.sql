ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "user_chats" ADD CONSTRAINT "user_chats_user_id_chat_id_unique" UNIQUE("user_id","chat_id");