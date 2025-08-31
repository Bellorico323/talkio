import { chatModule } from '@/modules/chat/infra/chat.module'
import { authModule } from '@/modules/identity/infra/lib/auth-handler'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'

async function bootstrap() {
  /** Event handlers */
  chatModule.execute()

  const app = fastify()

  app.register(authModule)

  app.register(fastifyCors, {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5713',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  })

  await app
    .listen({ port: 3000, host: '0.0.0.0' })
    .then(() => console.log('🚀 HTTP server running! at http://localhost:3000'))
}

bootstrap()
