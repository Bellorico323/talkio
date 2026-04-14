import { authenticate } from '@/infra/http/middlewares/authenticate'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { MakeDrizzleSearchUsersByUsername } from '../factories/drizzle/make-search-users-by-username'

export const searchUsersByUsernameController: FastifyPluginAsyncZod = async (
	app
) => {
	app.get(
		'/users',
		{
			preHandler: [authenticate],
			schema: {
				tags: ['users'],
				summary: 'List users, optionally filtered by username',
				querystring: z.object({
					username: z.string().optional(),
					page: z.coerce.number().int().min(1).default(1),
					limit: z.coerce.number().int().min(1).max(100).default(20),
				}),
				response: {
					200: z.object({
						users: z.array(
							z.object({
								name: z.string(),
								username: z.string(),
								email: z.string(),
								image: z.string().nullish(),
							})
						),
						total: z.number(),
						page: z.number(),
						limit: z.number(),
					}),
					401: z.object({ message: z.string() }).describe('Unauthorized'),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const { username, page, limit } = request.query

			const searchUserByUsernameUseCase = MakeDrizzleSearchUsersByUsername.make()

			const result = await searchUserByUsernameUseCase.execute({
				username,
				page,
				limit,
			})

			if (result.isLeft()) {
				const error = result.value
				return reply
					.status(500)
					.send({ message: `Erro ao buscar usuários: ${error}` })
			}

			const { users, total } = result.value

			return reply.status(200).send({ users, total, page, limit })
		}
	)
}
