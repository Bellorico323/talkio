import { Elysia } from 'elysia'
import { chat } from './routes/chat.js'
import { chatHistory } from './routes/chat-history.js'

const app = new Elysia()
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

  .use(chat)
  .use(chatHistory)

app.listen(3333, () => {
  console.log(
    `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
  )
})
