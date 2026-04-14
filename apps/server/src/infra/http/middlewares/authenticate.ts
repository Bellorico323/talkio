import { auth } from '@/modules/identity/infra/lib/auth'
import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
	interface FastifyRequest {
		user: { id: string; name: string; email: string }
	}
}

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const headers = new Headers(request.headers as HeadersInit)
	const session = await auth.api.getSession({ headers })

	if (!session || !session.user.id) {
		return reply.status(401).send({ message: 'Unauthorized' })
	}

	request.user = {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
	}
}
