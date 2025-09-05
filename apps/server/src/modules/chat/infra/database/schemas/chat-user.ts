import { pgTable, text, varchar, pgEnum } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { user } from '@/infra/database/schema/auth-schema'

export const chatUserStatusEnum = pgEnum('chat_user_status', [
  'online',
  'offline',
])

export const chatUsers = pgTable('chat_users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => sql`gen_random_uuid()`),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
    .unique(),

  status: chatUserStatusEnum('status').notNull().default('offline'),

  bio: varchar('bio', { length: 255 }),
})
