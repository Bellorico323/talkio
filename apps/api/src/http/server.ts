import { Elysia } from 'elysia'
import { connect } from './routes/connect.js'
import { chatHistory } from './routes/chat-history.js'
import cors from '@elysiajs/cors'
import { sendAuthLink } from './routes/send-auth-link.js'
import { authenticateFromLink } from './routes/authenticate-from-link.js'
import { fetchUserChats } from './routes/fetch-user-chats.js'
import { getProfile } from './routes/get-profile.js'
import { sendFriendshipRequest } from './routes/send-friendship-request.js'
import { getPendingInvites } from './routes/get-pending-invites.js'
import { fetchFriends } from './routes/fetch-friends.js'
import { auth } from './auth.js'

const app = new Elysia()
  .use(auth)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status
        return error.toResponse()
      }
      default: {
        set.status = 500

        console.error(error)

        return new Response(null, { status: 500 })
      }
    }
  })

  .use(connect)
  .use(chatHistory)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(fetchUserChats)
  .use(getProfile)
  .use(sendFriendshipRequest)
  .use(getPendingInvites)
  .use(fetchFriends)
  .use(cors())

app.listen(3333, () => {
  console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
  )
})
