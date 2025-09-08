import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { MakeDrizzleCreateGroup } from '../factories/drizzle/make-create-group'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { OwnerNotInformedError } from '../../application/use-cases/errors/owner-not-informed-error'

export const sendFriendshipRequestController: FastifyPluginAsyncZod = async (
  app
) => {
  app.post(
    '/groups',
    {
      schema: {
        tags: ['groups'],
        summary: 'Create a group',
        body: z.object({
          groupImage: z.string().optional(),
          groupDescription: z.string().optional(),
          ownerId: z.string(),
          participantsIds: z.array(z.string()),
          title: z.string(),
        }),
        response: {
          201: z.null(),
          404: z
            .object({ message: z.string() })
            .describe('Usuário não foi encontrado.'),
          400: z
            .object({ message: z.string() })
            .describe('Dono do grupo não informado.'),
        },
      },
    },
    async (request, reply) => {
      const { ownerId, participantsIds, title, groupDescription, groupImage } =
        request.body

      const createGroupUseCase = MakeDrizzleCreateGroup.make()

      const result = await createGroupUseCase.execute({
        ownerId,
        participantsIds,
        title,
        groupDescription,
        groupImage,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return reply.status(404).send({ message: 'Usuário não encontrado' })
          case OwnerNotInformedError:
            return reply
              .status(400)
              .send({ message: 'Dono do grupo não informado' })
          default:
            return reply
              .status(400)
              .send({ message: 'Erro ao criar convite de amizade.' })
        }
      }

      return reply.status(201).send()
    }
  )
}
