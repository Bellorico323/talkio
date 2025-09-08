import { sql } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { conversations } from './conversation'
import { user } from '@/infra/database/schema/auth-schema'
import { relations } from 'drizzle-orm'

export const conversationParticipants = pgTable('conversation_participants', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => sql`gen_random_uuid()`),
  conversationId: text('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('participant_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
})

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(user, {
      fields: [conversationParticipants.userId],
      references: [user.id],
    }),
  })
)
