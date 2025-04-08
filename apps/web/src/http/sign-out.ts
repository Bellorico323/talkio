import { api } from '@/lib/api-client'
import { HTTPError } from 'ky'

export async function signOut() {
  try {
    await api.post<{ message?: string }>('sign-out').json()
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { message }
    }

    console.error(error)

    return {
      message: 'Unexpected error, try again in a few minutes.',
    }
  }
}
