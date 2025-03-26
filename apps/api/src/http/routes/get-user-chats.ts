import { Elysia } from 'elysia'
import { auth } from '../auth'
import { db } from '@/db/connection'
import { userChats, users } from '@/db/schema'
import { and, eq, inArray, ne } from 'drizzle-orm'

export const getUserChats = new Elysia()
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
        friendName: users.name,
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
