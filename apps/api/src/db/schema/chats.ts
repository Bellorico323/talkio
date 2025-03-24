import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const chatTypeEnum = pgEnum('chat_type', ['private', 'group'])

export const chats = pgTable('chats', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name'),
  type: chatTypeEnum('type').default('private'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
})
