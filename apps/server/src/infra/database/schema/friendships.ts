import { pgTable, text, timestamp, unique, pgEnum } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'
import { sql } from 'drizzle-orm'

export const friendshipStatusEnum = pgEnum('friendship_status', [
  'pending',
  'accepted',
])

export const friendships = pgTable(
  'friendships',
  {
    id: text('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    requesterId: text('requester_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    addresseeId: text('addressee_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: friendshipStatusEnum('status').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  },
  (table) => {
    return {
      uniqueRequest: unique('unique_request').on(
        table.requesterId,
        table.addresseeId
      ),
    }
  }
)
