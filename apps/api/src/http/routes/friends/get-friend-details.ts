import { db } from '@/db/connection'
import { users } from '@/db/schema'
import { auth } from '@/http/auth'
import { eq } from 'drizzle-orm'
import Elysia from 'elysia'

export const friendDetails = new Elysia()
  .use(auth)
  .get('/friends/:friendId', async ({ params }) => {
    const { friendId } = params

    const [friend] = await db
      .select({
        friendId: users.id,
        friendName: users.name,
        friendAvatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, friendId))

    return {
      friend,
    }
  })
