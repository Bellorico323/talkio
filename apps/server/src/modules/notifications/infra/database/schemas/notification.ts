import { chatUsers } from '@/infra/database/schema/_index'
import { sql } from 'drizzle-orm'
import { pgTable, text, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const notificationType = pgEnum('notification_type', [
  'new_message',
  'friend_request',
])

export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => sql`gen_random_uuid()`),
  content: varchar('content', { length: 255 }).notNull(),
  senderId: text('sender_id')
    .notNull()
    .references(() => chatUsers.id, { onDelete: 'cascade' }),
  recipientId: text('sender_id')
    .notNull()
    .references(() => chatUsers.id, { onDelete: 'cascade' }),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('read_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  type: notificationType().notNull(),
})
