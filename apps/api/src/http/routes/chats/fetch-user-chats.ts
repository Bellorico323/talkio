import { Elysia } from 'elysia'
import { db } from '@/db/connection'
import { userChats, users } from '@/db/schema'
import { and, eq, inArray, ne } from 'drizzle-orm'
import { auth } from '@/http/auth'

export const fetchUserChats = new Elysia()
  .use(auth)
  .get('/chats', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const chatIds = await db.query.userChats.findMany({
      columns: {
        chatId: true,
      },
      where(fields, { eq }) {
        return eq(fields.userId, userId)
      },
    })

    const chatIdList = chatIds
      .filter((chat) => chat.chatId !== null)
      .map((chat) => chat.chatId as string)

    const chats = await db
      .select({
        friendId: users.id,
        chatId: userChats.chatId,
        friendName: users.name,
        avatarUrl: users.avatarUrl,
      })
      .from(userChats)
      .innerJoin(users, eq(users.id, userChats.userId))
      .where(
        and(
          inArray(userChats.chatId, chatIdList),
          ne(userChats.userId, userId),
        ),
      )

    return {
      chats,
    }
  })
