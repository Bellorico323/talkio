import { db } from '@/db/connection'
import { chats, messages, userChats } from '@/db/schema'
import { Elysia, t } from 'elysia'
import type { ElysiaWS } from 'elysia/ws'
import { auth } from '../auth'
import { createId } from '@paralleldrive/cuid2'

const clients = new Map<string, Set<ElysiaWS>>()

export const connect = new Elysia().use(auth).ws('/connect', {
  body: t.Object({
    friendId: t.String(),
    chatId: t.Optional(t.String()),
    content: t.String(),
  }),

  async open(ws) {
    // TODO: Session  managment with Redis
    console.log(`Client ${ws.id} connected.`)
  },

  async message(ws, message) {
    const { userId } = await ws.data.getCurrentUser()

    const { friendId, chatId: chatIdFromRequest, content } = message

    let chatId = chatIdFromRequest

    if (!chatId || chatId === 'new-chat') {
      const [chat] = await db
        .insert(chats)
        .values({
          name: `${userId} - ${friendId}`,
          type: 'private',
        })
        .returning()

      if (!chat) throw new Error('Error creating chat.')

      chatId = chat.id

      const isUsersFriends = await db.query.friendships.findMany({
        where(fields, { eq, or, and }) {
          return or(
            and(eq(fields.friendId, friendId), eq(fields.userId, userId)),
            and(eq(fields.friendId, userId), eq(fields.userId, friendId)),
          )
        },
      })

      if (isUsersFriends.length < 1) {
        throw new Error('Users are not friends.')
      }

      await db.insert(userChats).values([
        {
          userId,
          chatId: chat.id,
        },
        {
          userId: friendId,
          chatId: chat.id,
        },
      ])
    }

    if (!clients.has(chatId)) {
      clients.set(chatId, new Set())
    }

    clients.get(chatId)?.add(ws)

    const messageId = createId()
    const newMessage = {
      id: messageId,
      content,
      chatId,
      userId,
    }

    for (const client of clients.get(chatId) ?? []) {
      client.send(newMessage)
    }

    await db.insert(messages).values(newMessage)
  },

  close(ws) {
    console.log(`Client ${ws.id} disconnected.`)
    // TODO: session managment with Redis

    for (const [chatId, chatClients] of clients.entries()) {
      chatClients.delete(ws)

      if (chatClients.size === 0) {
        clients.delete(chatId)
      }
    }
  },
})
