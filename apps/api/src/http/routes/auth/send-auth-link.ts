import { db } from '@/db/connection'
import { authLinks } from '@/db/schema'
import { env } from '@/env'
import { mail } from '@/lib/mail'
import { createId } from '@paralleldrive/cuid2'
import Elysia, { t } from 'elysia'
import nodemailer from 'nodemailer'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body, set }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.email, email),
    })

    if (!userFromEmail) {
      throw new Error('User not found.')
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    const info = await mail.sendMail({
      from: {
        name: 'Talkio',
        address: 'hi@talkio.com',
      },
      to: email,
      subject: 'Authenticate to Talkio',
      text: `Use the followinng link to authenticate on Talkio: ${authLink.toString()}`,
    })

    console.log(nodemailer.getTestMessageUrl(info))

    set.status = 204
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
