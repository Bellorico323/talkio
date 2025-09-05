import { chatModule } from '@/modules/chat/infra/chat.module'
import { friendshipModule } from '@/modules/friendships/infra/friendships.module'
import { authModule } from '@/modules/identity/infra/lib/auth-handler'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { AppModule } from './contracts/app-module'
import fastifySwagger from '@fastify/swagger'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { instanciateGateway } from './websocket/websocket-gateway'
import fastifyWebsocket from '@fastify/websocket'
import { notificationModule } from '@/modules/notifications/infra/notifications.module'
import { InMemoryEventBus } from '@/shared/domain/events/in-memory-event-bus'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

async function bootstrap() {
  const app = fastify()
  app.register(fastifyWebsocket)

  app.register(async function (app) {
    instanciateGateway(app)
  })

  const inMemoryEventBus = new InMemoryEventBus()
  DomainEvents.initialize(inMemoryEventBus, inMemoryEventBus)

  if (process.env.NODE_ENV === 'development') {
    app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Talkio api',
          version: '1.0.0',
        },
      },
      transform: jsonSchemaTransform,
    })

    app.register(scalarAPIReference, {
      routePrefix: '/docs',
    })
  }

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyCors, {
    origin: process.env.CLIENT_ORIGIN || 'https://localhost:5713',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  })

  const modules: AppModule[] = [
    friendshipModule,
    chatModule,
    notificationModule,
  ]

  for (const module of modules) {
    if (module.registerDomainHandlers) {
      await module.registerDomainHandlers()
    }

    if (module.registerWsHandlers) {
      await module.registerWsHandlers()
    }

    if (module.routes) {
      await module.routes(app)
    }
  }

  app.register(authModule)

  await app
    .listen({ port: 3000, host: '0.0.0.0' })
    .then(() =>
      console.log('🚀 HTTPS server running! at http://localhost:3000')
    )
}

bootstrap()
