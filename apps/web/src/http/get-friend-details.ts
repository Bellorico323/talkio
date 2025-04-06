import { api } from '@/lib/api-client'
import { HTTPError } from 'ky'

interface GetFriendDetailsRequest {
  friendId?: string | null
}

interface GetFriendDetailsResponse {
  friend: {
    friendId: string
    friendName: string
    friendAvatarUrl: string | null
  }
}

export async function getFriendDetails({
  friendId,
}: GetFriendDetailsRequest): Promise<GetFriendDetailsResponse> {
  try {
    const response = await api
      .get(`friends/${friendId}`)
      .json<GetFriendDetailsResponse>()

    return response
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      throw new Error(message)
    }

    throw new Error('Unexpected error, try again in a few minutes.')
  }
}
