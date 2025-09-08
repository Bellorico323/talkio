import { user } from '@/infra/database/schema/auth-schema'
import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { conversations } from './conversation'

export const messages = pgTable('message', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => sql`gen_random_uuid()`),
  conversationId: text('conversation_id')
    .references(() => conversations.id)
    .notNull(),
  senderId: text('conversation_id')
    .references(() => user.id)
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
