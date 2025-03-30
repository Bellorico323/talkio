import { api } from '@/lib/api-client'
import { HTTPError } from 'ky'

interface SendFriendshipInviteRequest {
  usernameWithCode: string
}

interface SendFriendshipInviteResponse {
  message?: string
}

export async function sendFriendshipInvite({
  usernameWithCode,
}: SendFriendshipInviteRequest): Promise<SendFriendshipInviteResponse> {
  const encodedUsername = encodeURIComponent(usernameWithCode)

  try {
    const response = await api
      .post<{ message?: string }>(`friendships/invite/${encodedUsername}`)
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
