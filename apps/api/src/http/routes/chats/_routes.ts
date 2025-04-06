import Elysia from 'elysia'
import { chatMessages } from './chat-messages'
import { fetchUserChats } from './fetch-user-chats'
import { recentChats } from './recent-chats'

export const chatRoutes = new Elysia()
  .use(chatMessages)
  .use(fetchUserChats)
  .use(recentChats)
