import { FastifyReply, FastifyRequest } from 'fastify'
import { MakeDrizzleSendFriendshipRequest } from '../factories/drizzle/make-send-friendship-request'
import z from 'zod'

const sendFriendshipRequestControllerBody = z.object({
  requesterId: z.string(),
  addresseeId: z.string(),
})

export async function sendFriendshipRequestController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = sendFriendshipRequestControllerBody.parse(request.body)

  const sendFriendShipRequest = MakeDrizzleSendFriendshipRequest.make()

  const result = await sendFriendShipRequest.execute(data)

  if (result.isLeft()) {
    return reply.status(400).send()
  }

  return reply.status(201).send()
}
