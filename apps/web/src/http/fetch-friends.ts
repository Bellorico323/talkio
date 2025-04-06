import { api } from '@/lib/api-client'

interface FetchFriendsQuery {
  friendName?: string
}

interface FetchFriendsResponse {
  friends: {
    friendId: string
    friendName: string
    chatId: string | null
    avatarUrl: string
  }[]
}

export async function fetchFriends({
  friendName,
}: FetchFriendsQuery): Promise<FetchFriendsResponse> {
  try {
    const params = friendName ? { friendName } : undefined

    const response = await api
      .get<FetchFriendsResponse>('friends', {
        searchParams: params,
      })
      .json()

    return response
  } catch (error) {
    console.error(error)

    return { friends: [] }
  }
}
