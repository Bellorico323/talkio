import Elysia from 'elysia'
import { chatHistory } from './chat-history'
import { fetchUserChats } from './fetch-user-chats'

export const chatRoutes = new Elysia().use(chatHistory).use(fetchUserChats)
