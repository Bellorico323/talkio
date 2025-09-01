import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { MakeDrizzleRejectFriendshipRequest } from '../factories/drizzle/make-reject-friendship-request'

export const rejectFriendshipController: FastifyPluginAsyncZod = async (
  app
) => {
  app.put(
    '/friendships/reject',
    {
      schema: {
        tags: ['friendships'],
        summary: 'Reject a friendship request',
        body: z.object({
          userId: z.string(),
          friendshipId: z.string(),
        }),
        response: {
          200: z.null(),
          400: z
            .object({ message: z.string() })
            .describe('Erro ao rejeitar convite de amizade.'),
        },
      },
    },
    async (request, reply) => {
      const data = request.body

      const rejectFriendShipRequest = MakeDrizzleRejectFriendshipRequest.make()

      const result = await rejectFriendShipRequest.execute(data)

      if (result.isLeft()) {
        return reply.status(400).send({ message: result.value.message })
      }

      return reply.status(200).send()
    }
  )
}
