import Elysia from 'elysia'
import { sendAuthLink } from './send-auth-link'
import { authenticateFromLink } from './authenticate-from-link'
import { getProfile } from './get-profile'
import { signOut } from './sign-out'

export const authRoutes = new Elysia()
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(getProfile)
  .use(signOut)
