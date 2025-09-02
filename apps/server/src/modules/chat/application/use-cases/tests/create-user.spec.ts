import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryChatUsersRepository } from 'test/repositories/chat/in-memory-chat-users-repository'
import { ChatUser } from '@/modules/chat/domain/entities/chat-user'
import { CreateChatUserUseCase } from '../create-user'

let chatUsersRepository: InMemoryChatUsersRepository
let sut: CreateChatUserUseCase

beforeEach(() => {
  chatUsersRepository = new InMemoryChatUsersRepository()
  sut = new CreateChatUserUseCase(chatUsersRepository)
})

describe('Create Chat User Use Case', () => {
  it('should be able to create a new chat user', async () => {
    const request = {
      userId: 'user-123',
    }

    const result = await sut.execute(request)

    expect(result.isRight()).toBe(true)
    expect(chatUsersRepository.items).toHaveLength(1)
    const createdChatUser = chatUsersRepository.items[0]!
    expect(createdChatUser).toBeInstanceOf(ChatUser)
    expect(createdChatUser.userId.toString()).toBe('user-123')

    if (result.isRight()) {
      expect(result.value.chatUser.userId.toString()).toBe('user-123')
    }
  })
})
