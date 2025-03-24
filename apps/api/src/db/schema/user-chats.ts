import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { chats } from './chats'
import { users } from './users'

export const userChats = pgTable('user_chats', {
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
  joinedAt: timestamp('created_at').notNull().defaultNow(),
})
