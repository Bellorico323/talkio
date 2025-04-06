import Elysia from 'elysia'
import { sendFriendshipRequest } from './send-friendship-request'
import { fetchFriends } from './fetch-friends'
import { getPendingInvites } from './get-pending-invites'
import { friendDetails } from './get-friend-details'

export const friendsRoutes = new Elysia()
  .use(sendFriendshipRequest)
  .use(fetchFriends)
  .use(getPendingInvites)
  .use(friendDetails)
