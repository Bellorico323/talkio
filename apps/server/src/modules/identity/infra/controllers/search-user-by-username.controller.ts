import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { MakeDrizzleSearchUsersByUsername } from '../factories/drizzle/make-search-users-by-username'

export const searchUsersByUsernameController: FastifyPluginAsyncZod = async (
	app
) => {
	app.get(
		'/users',
		{
			schema: {
				tags: ['users'],
				summary: 'Search users by username',
				querystring: z.object({
					username: z.string(),
				}),
				response: {
					200: z.object({
						users: z.array(z.object({
							name: z.string(),
							username: z.string(),
							email: z.string(),
							image: z.string().nullish(),
						})),
					}),
					500: z
						.object({ message: z.string() })
						.describe('Dono do grupo não informado.'),
				},
			},
		},
		async (request, reply) => {
			const { username } = request.query

			const searchUserByUsernameUseCase = MakeDrizzleSearchUsersByUsername.make()

			const result = await searchUserByUsernameUseCase.execute({
				username,
			})

			if (result.isLeft()) {
				const error = result.value
				return reply
					.status(500)
					.send({ message: `Erro ao criar convite de amizade: ${error}` })
			}

			return reply.status(200).send({
				users: result.value.users
			})
		}
	)
}
