import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/infra/database/client'
import * as schema from '@/infra/database/schema/_index'
import { createAuthMiddleware } from 'better-auth/api'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { User } from '../../domain/entities/user'

export const auth = betterAuth({
	user: {
		additionalFields: {
			username: {
				type: "string",
				required: true,
				unique: true,
			},
		},
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === '/sign-up/email') {
				const returned = ctx.context.returned as { user?: { id?: string; name?: string; email?: string } }
				const raw = returned?.user

				if (!raw?.id || !raw?.name || !raw?.email) return

				const user = User.create(
					{
						name: raw.name,
						username: raw.name,
						email: raw.email,
						emailVerifield: false,
					},
					new UniqueEntityID(raw.id)
				)

				await DomainEvents.dispatchEventsForAggregate(user.id)
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
