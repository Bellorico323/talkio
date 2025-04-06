import Elysia, { t } from 'elysia'
import { auth } from '@/http/auth'
import { db } from '@/db/connection'
import { friendships, userChats, users } from '@/db/schema'
import { and, asc, eq, ilike, inArray } from 'drizzle-orm'

export const fetchFriends = new Elysia().use(auth).get(
  '/friends',
  async ({ getCurrentUser, query }) => {
    const { userId } = await getCurrentUser()
    const { friendName } = query

    const friends = await db
      .select({
        friendId: users.id,
        friendName: users.name,
        chatId: userChats.chatId,
        avatarUrl: users.avatarUrl,
      })
      .from(friendships)
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
      .where(
        and(
          eq(friendships.userId, userId),
          friendName ? ilike(users.name, `%${friendName}%`) : undefined,
        ),
      )
      .orderBy(asc(users.name))

    return {
      friends,
    }
  },
  {
    query: t.Object({
      friendName: t.Optional(t.String()),
    }),
  },
)
