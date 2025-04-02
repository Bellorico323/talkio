import { Elysia } from 'elysia'
import { connect } from './routes/connect.js'
import cors from '@elysiajs/cors'
import { auth } from './auth.js'
import { authRoutes } from './routes/auth/_routes.js'
import { chatRoutes } from './routes/chats/_routes.js'
import { friendsRoutes } from './routes/friends/_routes.js'

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
  .use(authRoutes)
  .use(chatRoutes)
  .use(friendsRoutes)
  .use(connect)
  .use(cors())

app.listen(3333, () => {
  console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
  )
})
