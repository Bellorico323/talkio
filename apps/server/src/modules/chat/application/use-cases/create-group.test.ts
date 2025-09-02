import { InMemoryConversationsRepository } from 'test/repositories/chat/in-memory-conversations-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateGroupUseCase } from './create-group'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { InMemoryChatUsersRepository } from 'test/repositories/chat/in-memory-chat-users-repository'
import { makeChatUser } from 'test/factories/make-chat-user'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

let conversationsRepository: InMemoryConversationsRepository
let chatUsersRepository: InMemoryChatUsersRepository
let sut: CreateGroupUseCase // sut = System Under Test (o nosso caso de uso)

beforeEach(() => {
  conversationsRepository = new InMemoryConversationsRepository()
  chatUsersRepository = new InMemoryChatUsersRepository()
  sut = new CreateGroupUseCase(conversationsRepository, chatUsersRepository)
})

describe('Create Group Use Case', () => {
  it('should be able to create a new group conversation', async () => {
    chatUsersRepository.items.push(
      makeChatUser({}, new UniqueEntityID('user-1'))
    )

    const request = {
      ownerId: 'user-1',
      title: 'Grupo dos Devs',
      participantsIds: ['user-2', 'user-3'],
    }

    const result = await sut.execute(request)

    expect(result.isRight()).toBe(true)
    expect(conversationsRepository.items).toHaveLength(1)
    const createdConversation = conversationsRepository.items[0]!

    expect(createdConversation.isGroup).toBe(true)
    expect(createdConversation.title).toBe('Grupo dos Devs')
    expect(createdConversation.ownerId?.toString()).toBe('user-1')

    expect(createdConversation.participantsIds).toHaveLength(3)
    expect(
      createdConversation.participantsIds.some((p) => p.toString() === 'user-1')
    ).toBe(true)
  })

  it('should not be able to create a group if the owner id is not informed', async () => {
    const request = {
      ownerId: 'user-1',
      title: 'Grupo dos Devs',
      participantsIds: ['user-2', 'user-3'],
    }

    const result = await sut.execute(request)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(conversationsRepository.items).toHaveLength(0)
  })
})
