import { ChatUser } from '../../domain/entities/chat-user'

export interface ChatUsersRepository {
  create(chatUser: ChatUser): Promise<void>
  findById(userId: string): Promise<ChatUser | null>
}
