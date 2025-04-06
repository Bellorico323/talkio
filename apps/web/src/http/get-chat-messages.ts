import { api } from '@/lib/api-client'
import { HTTPError } from 'ky'

interface GetChatMessagesRequest {
  chatId?: string
}

interface Message {
  id: string
  userId: string | null
  chatId: string | null
  content: string
  createdAt: Date
  updatedAt: Date | null
}

interface GetChatMessagesResponse {
  messages: Message[]
}

export async function getChatMessages({
  chatId,
}: GetChatMessagesRequest): Promise<GetChatMessagesResponse> {
  try {
    const response = await api
      .get(`chats/${chatId}/messages`)
      .json<GetChatMessagesResponse>()

    return response
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      throw new Error(message)
    }

    throw new Error('Unexpected error, try again in a few minutes.')
  }
}
