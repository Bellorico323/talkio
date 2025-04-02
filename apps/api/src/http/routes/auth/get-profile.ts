import Elysia from 'elysia'
import { db } from '@/db/connection'
import { auth } from '@/http/auth'
import { UnauthorizedError } from '@/http/errors/unauthorized-error'

export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    return { user }
  })
