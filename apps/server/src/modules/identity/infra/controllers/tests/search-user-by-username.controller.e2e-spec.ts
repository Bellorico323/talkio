import request from 'supertest'
import { app } from '@/infra/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { signUpAndGetCookie } from 'test/utils/signup-test-user'

describe('Search users by username (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search users by username', async () => {
    const cookie = await signUpAndGetCookie(request, app, {
      email: 'auth.user@example.com',
      password: 'password123456',
      name: 'Auth User',
      username: 'auth.user',
    })

    await request(app.server).post('/api/auth/sign-up/email').send({
      email: 'john.doe@example.com',
      password: 'password123456',
      name: 'John Doe',
      username: 'john.doe',
    })

    const response = await request(app.server)
      .get('/users?username=john')
      .set('Cookie', cookie)

    expect(response.statusCode).toEqual(200)
    expect(response.body.users.length).toBeGreaterThan(0)
    expect(response.body.users[0].username).toBe('john.doe')
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(app.server).get('/users')

    expect(response.statusCode).toEqual(401)
  })
})
