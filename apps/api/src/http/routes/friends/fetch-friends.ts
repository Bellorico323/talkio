import Elysia, { t } from 'elysia'
import { auth } from '@/http/auth'
import { db } from '@/db/connection'
import { friendships, userChats, users } from '@/db/schema'
import { and, asc, eq, inArray } from 'drizzle-orm'

export const fetchFriends = new Elysia().use(auth).get(
  '/friends',
  async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const friends = await db
      .select({
        friendName: users.name,
        chatId: userChats.chatId,
      })
      .from(friendships)
      .where(eq(friendships.userId, userId))
      .innerJoin(users, eq(users.id, friendships.friendId))
      .leftJoin(
        userChats,
        and(
          eq(userChats.userId, users.id),
          inArray(
            userChats.chatId,
            db
              .select({ chatId: userChats.chatId })
              .from(userChats)
              .where(eq(userChats.userId, userId)),
          ),
        ),
      )
      .orderBy(asc(users.name))

    return {
      friends,
    }
  },
  {
    query: t.Object({
      search: t.Optional(t.String()),
    }),
  },
)
