import { Elysia } from 'elysia'
import { auth } from '../auth'

export const chatHistory = new Elysia()
  .use(auth)
  .get('/chat/:chatId/history', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    console.log(userId)
  })
