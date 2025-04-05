import { Elysia } from 'elysia'
import { auth } from '@/http/auth'
import { db } from '@/db/connection'
import { messages, users, userChats } from '@/db/schema'
import { and, desc, eq, inArray, ne } from 'drizzle-orm'

export const recentChats = new Elysia()
  .use(auth)
  .get('/chats/recents', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const recentChatIds = db.$with('recentChatsIds').as(
      db
        .select({
          chatId: messages.chatId,
        })
        .from(messages)
        .where(eq(messages.userId, userId))
        .orderBy(desc(messages.createdAt))
        .limit(3),
    )

    const chatIds = await db.with(recentChatIds).select().from(recentChatIds)

    if (chatIds.length === 0) {
      return { recentChats: [] }
    }

    const chatIdsList = chatIds
      .map((item) => item.chatId)
      .filter((id): id is string => id !== null)

    const recentChats = await db
      .select({
        chatId: userChats.chatId,
        friendId: users.id,
        friendName: users.name,
        friendAvatarUrl: users.avatarUrl,
        message: messages.content,
        lastContact: messages.createdAt,
      })
      .from(userChats)
      .innerJoin(users, eq(users.id, userChats.userId))
      .innerJoin(
        messages,
        and(
          eq(messages.chatId, userChats.chatId),
          eq(messages.userId, userChats.userId),
        ),
      )
      .where(
        and(
          inArray(userChats.chatId, chatIdsList),
          ne(userChats.userId, userId),
        ),
      )
      .orderBy(desc(messages.createdAt))

    return {
      recentChats,
    }
  })
