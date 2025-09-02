import {
  ChatUser,
  ChatUserProps,
} from '@/modules/chat/domain/entities/chat-user'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeChatUser(
  override: Partial<ChatUserProps> = {},
  id?: UniqueEntityID
) {
  const chatUser = ChatUser.create(
    {
      bio: faker.person.bio(),
      userId: new UniqueEntityID(),
      status: faker.helpers.arrayElement(['offline', 'online']),
      ...override,
    },
    id
  )

  return chatUser
}
