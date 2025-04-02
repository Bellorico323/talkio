import Elysia from 'elysia'
import { auth } from '@/http/auth'
import { db } from '@/db/connection'
import { friendships, users } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

export const sendFriendshipRequest = new Elysia()
  .use(auth)
  .post(
    '/friendships/invite/:usernameWithCode',
    async ({ getCurrentUser, params, set }) => {
      const { userId } = await getCurrentUser()

      const { usernameWithCode } = params

      const [username, code] = decodeURIComponent(usernameWithCode)
        .toString()
        .split('#')

      if (!username || !code) {
        set.status = 400
        return { message: 'Invalid username or code.' }
      }

      const [userToInvite] = await db
        .select()
        .from(users)
        .where(
          and(sql`LEFT(${users.id}, 4) = ${code}`, eq(users.name, username)),
        )

      if (!userToInvite) {
        set.status = 404
        return { message: 'Resource not found' }
      }

      if (userId === userToInvite.id) {
        set.status = 400
        return { message: 'You cannot send a friend request to yourself.' }
      }

      const friendshipAlreadyExists = await db.query.friendships.findFirst({
        where(fields, { eq, and }) {
          return and(
            eq(fields.userId, userId),
            eq(fields.friendId, userToInvite.id),
          )
        },
      })

      if (friendshipAlreadyExists) {
        set.status = 400
        return { message: 'Friendship request already sent.' }
      }

      await db.insert(friendships).values({
        userId,
        friendId: userToInvite.id,
        status: 'pending',
      })

      set.status = 204
    },
  )
