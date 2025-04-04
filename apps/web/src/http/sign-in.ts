import { api } from '@/lib/api-client'
import { HTTPError } from 'ky'

interface SignInRequest {
  email: string
}

interface SignInResponse {
  message?: string
}

export async function signIn({
  email,
}: SignInRequest): Promise<SignInResponse> {
  try {
    const response = await api
      .post<{ message?: string }>(`authenticate`, {
        json: {
          email,
        },
      })
      .json()

    return response
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
