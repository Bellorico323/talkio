import { app } from './app'

async function bootstrap() {
  await app
    .listen({ port: 3000, host: '0.0.0.0' })
    .then(() =>
      console.log('🚀 HTTPS server running! at http://localhost:3000')
    )
}

bootstrap()
