import Elysia from 'elysia'
import { chatHistory } from './chat-history'
import { fetchUserChats } from './fetch-user-chats'
import { recentChats } from './recent-chats'

export const chatRoutes = new Elysia()
  .use(chatHistory)
  .use(fetchUserChats)
  .use(recentChats)
