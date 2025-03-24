import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { relations } from 'drizzle-orm'
import { chats } from './chats'

export const messages = pgTable('messages', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  chatId: text('chat_id').references(() => chats.id, {
    onDelete: 'no action',
  }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})

export const messagesRelations = relations(messages, ({ one }) => {
  return {
    user: one(users, {
      fields: [messages.userId],
      references: [users.id],
      relationName: 'user_message',
    }),
    chat: one(chats, {
      fields: [messages.chatId],
      references: [chats.id],
      relationName: 'chat_message',
    }),
  }
})
