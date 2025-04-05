import { api } from '@/lib/api-client'

interface FetchRecentChatsResponse {
  recentChats: {
    chatId: string | null
    friendId: string
    friendName: string
    friendAvatarUrl: string | null
    message: string
    lastContact: Date
  }[]
}

export async function fetchRecentChats(): Promise<FetchRecentChatsResponse> {
  try {
    const response = await api
      .get<FetchRecentChatsResponse>('chats/recents')
      .json()

    return response
  } catch (error) {
    console.error(error)

    return { recentChats: [] }
  }
}
