import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { users } from './users'

export const friendshipStatus = pgEnum('friendship_status', [
  'pending',
  'accepted',
  'blocked',
  'declined',
])

export const friendships = pgTable(
  'friendships',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    friendId: text('friend_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    status: friendshipStatus('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.friendId)],
)

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.userId],
    references: [users.id],
  }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
  }),
}))
