import { ChatUser } from '../../domain/entities/chat-user'

export interface ChatUsersRepository {
  create(chatUser: ChatUser): Promise<void>
  findById(chatUserId: string): Promise<ChatUser | null> // by chatUser.id
  findByUserId(userId: string): Promise<ChatUser | null> // by chatUser.userId
}
