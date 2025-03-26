import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { chats } from './chats'
import { users } from './users'
import { relations } from 'drizzle-orm'

export const userChats = pgTable(
  'user_chats',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    chatId: text('chat_id').references(() => chats.id, {
      onDelete: 'no action',
    }),
    userId: text('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.chatId)],
)

export const userChatsRelations = relations(userChats, ({ one }) => {
  return {
    chats: one(chats, {
      fields: [userChats.chatId],
      references: [chats.id],
      relationName: 'user_chat_chat',
    }),
    users: one(users, {
      fields: [userChats.userId],
      references: [users.id],
      relationName: 'user_chat_user',
    }),
  }
})
