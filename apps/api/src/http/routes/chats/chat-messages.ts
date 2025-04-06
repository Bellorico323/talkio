import { Elysia } from 'elysia'
import { auth } from '@/http/auth'
import { db } from '@/db/connection'
import { messages } from '@/db/schema'
import { and, asc, eq } from 'drizzle-orm'

export const chatMessages = new Elysia()
  .use(auth)
  .get('/chats/:chatId/messages', async ({ params, set }) => {
    const { chatId } = params

    if (!chatId) {
      set.status = 'Bad Request'
      return { message: 'You cannot get messages without informing a chat id.' }
    }

    const chatMessages = await db
      .select()
      .from(messages)
      .where(and(eq(messages.chatId, chatId)))
      .orderBy(asc(messages.createdAt))

    return {
      messages: chatMessages,
    }
  })
