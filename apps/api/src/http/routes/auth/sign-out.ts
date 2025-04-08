import Elysia from 'elysia'
import { auth } from '@/http/auth'

export const signOut = new Elysia()
  .use(auth)
  .post('/sign-out', ({ signOut: internalSignOut }) => {
    internalSignOut()
  })
