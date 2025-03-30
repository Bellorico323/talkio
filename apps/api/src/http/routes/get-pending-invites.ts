import Elysia from 'elysia'
import { auth } from '../auth'
import { db } from '@/db/connection'

export const getPendingInvites = new Elysia()
  .use(auth)
  .get('/friendships/invites', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const pendingInvites = await db.query.friendships.findMany({
      columns: {
        id: true,
        createdAt: true,
      },
      with: {
        friend: {
          columns: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      where(fields, { eq, and }) {
        return and(eq(fields.userId, userId), eq(fields.status, 'pending'))
      },
    })

    return {
      pendingInvites,
    }
  })
