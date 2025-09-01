import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/infra/database/client'
import * as schema from '@/infra/database/schema/_index'
import { createAuthMiddleware } from 'better-auth/api'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { authResponseSchema } from '../zod-schemas/user-schema'
import { UserMapper } from '../mappers/better-auth-user-mapper'

export const auth = betterAuth({
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        console.log(ctx.context.returned)

        const result = authResponseSchema.safeParse(ctx.context.returned)

        if (!result.success) {
          throw new Error('Error creating user')
        }

        const { user: userCreated } = result.data

        const user = UserMapper.toDomain(userCreated)

        DomainEvents.dispatchEventsForAggregate(user.id)
      }
    }),
  },

  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  trustedOrigins: ['*'],
})
