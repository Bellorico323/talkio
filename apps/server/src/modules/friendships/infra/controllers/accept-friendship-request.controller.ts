import { MakeDrizzleSendFriendshipRequest } from '../factories/drizzle/make-send-friendship-request'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { MakeDrizzleAccepFriendshipRequest } from '../factories/drizzle/make-accept-friendship-request'

export const acceptFriendshipController: FastifyPluginAsyncZod = async (
  app
) => {
  app.put(
    '/friendships/accept',
    {
      schema: {
        tags: ['friendships'],
        summary: 'Accept a friendship request',
        body: z.object({
          userId: z.string(),
          friendshipId: z.string(),
        }),
        response: {
          201: z.null(),
          400: z
            .object({ message: z.string() })
            .describe('Erro ao aceitar convite de amizade.'),
        },
      },
    },
    async (request, reply) => {
      const data = request.body

      const acceptFriendShipRequest = MakeDrizzleAccepFriendshipRequest.make()

      const result = await acceptFriendShipRequest.execute(data)

      if (result.isLeft()) {
        return reply.status(400).send({ message: result.value.message })
      }

      return reply.status(201).send()
    }
  )
}
