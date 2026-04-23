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
import fastifyWebsocket from '@fastify/websocket'
import { notificationModule } from '@/modules/notifications/infra/notifications.module'
import { InMemoryEventBus } from '@/shared/domain/events/in-memory-event-bus'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { websocketPlugin } from './websocket/ws-plugin'
import { identityModule } from '@/modules/identity/infra/identity.module'

export const app = fastify()

app.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
})

app.register(authModule)

app.register(fastifyWebsocket)
app.register(websocketPlugin)

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

const inMemoryEventBus = new InMemoryEventBus()
DomainEvents.initialize(inMemoryEventBus, inMemoryEventBus)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

const modules: AppModule[] = [
  friendshipModule,
  chatModule,
  notificationModule,
  identityModule,
]

app.after(async () => {
  for (const module of modules) {
    if (module.registerDomainHandlers) {
      await module.registerDomainHandlers(app)
    }

    if (module.registerWsHandlers) {
      await module.registerWsHandlers(app)
    }

    if (module.routes) {
      await module.routes(app)
    }
  }
})
