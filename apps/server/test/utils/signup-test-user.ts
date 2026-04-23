import { FastifyInstance } from 'fastify'
import { SuperTestStatic } from 'supertest'

export async function signUpAndGetCookie(
  request: SuperTestStatic,
  app: FastifyInstance,
  params: {
    email: string
    password: string
    name: string
    username: string
  }
): Promise<string> {
  const res = await request(app.server)
    .post('/api/auth/sign-up/email')
    .send(params)

  const setCookieHeader = res.headers['set-cookie'] as string[] | string
  const cookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader]

  const sessionCookie = cookies
    .find((c) => c.startsWith('better-auth.session_token='))
    ?.split(';')[0]

  if (!sessionCookie) throw new Error('Session cookie not found after sign-up')

  return sessionCookie
}
