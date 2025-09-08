import { user } from '@/infra/database/schema/auth-schema'
import { sql } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const conversations = pgTable('conversations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => sql`gen_random_uuid()`),
  title: text('title'),
  isGroup: boolean('is_group').notNull(),
  groupImage: varchar('group_image', { length: 200 }),
  groupDescription: text('group_description'),
  ownerId: text('owner_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
