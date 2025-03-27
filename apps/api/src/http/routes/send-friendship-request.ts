import Elysia from 'elysia'
import { auth } from '../auth'
import { db } from '@/db/connection'
import { friendships } from '@/db/schema'

export const sendFriendshipRequest = new Elysia()
  .use(auth)
  .post(
    '/friendships/invite/:userId',
    async ({ getCurrentUser, params, set }) => {
      const { userId } = await getCurrentUser()

      const { userId: userToInviteId } = params

      if (userId === userToInviteId) {
        set.status = 400
        return { error: 'You cannot send a friend request to yourself.' }
      }

      const userToInvite = await db.query.users.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, userToInviteId)
        },
      })

      if (!userToInvite) {
        set.status = 404
        return { error: 'Resource not found' }
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
        return { error: 'Friendship request already sent.' }
      }

      await db.insert(friendships).values({
        userId,
        friendId: userToInvite.id,
        status: 'pending',
      })

      set.status = 204
    },
  )
