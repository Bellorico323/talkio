import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { InMemoryConversationsRepository } from 'test/repositories/chat/in-memory-conversations-repository'
import { makeConversation } from 'test/factories/make-conversation'
import { Conversation } from '@/modules/chat/domain/entities/conversation'
import { SendDirectMessageUseCase } from '../send-direct-message'

let conversationsRepository: InMemoryConversationsRepository
let sut: SendDirectMessageUseCase // System Under Test

beforeEach(() => {
  conversationsRepository = new InMemoryConversationsRepository()
  sut = new SendDirectMessageUseCase(conversationsRepository)
})

describe('Send Direct Message Use Case', () => {
  it('should be able to send a message and create a new conversation if it does not exist', async () => {
    const request = {
      senderId: 'user-1',
      recipientId: 'user-2',
      content: 'Olá! Tudo bem?',
    }

    const result = await sut.execute(request)

    expect(result.isRight()).toBe(true)
    expect(conversationsRepository.items).toHaveLength(1)

    const conversation = conversationsRepository.items[0]!
    expect(conversation.messages).toHaveLength(1)
    expect(conversation.messages[0]!.content).toBe('Olá! Tudo bem?')
    expect(conversation.participantsIds).toHaveLength(2)
  })

  it('should be able to send a message to an existing conversation', async () => {
    const preExistingConversation = makeConversation({
      isGroup: false,
      participantsIds: [
        new UniqueEntityID('user-1'),
        new UniqueEntityID('user-2'),
      ],
    })
    conversationsRepository.items.push(preExistingConversation)

    const request = {
      senderId: 'user-1',
      recipientId: 'user-2',
      content: 'Estou bem, e você?',
    }

    const result = await sut.execute(request)

    expect(result.isRight()).toBe(true)

    expect(conversationsRepository.items).toHaveLength(1)

    const conversation = conversationsRepository.items[0]!

    expect(conversation.messages).toHaveLength(1)
    expect(conversation.messages[0]!.content).toBe('Estou bem, e você?')
  })

  it('should be able to send a message to an existing conversation by its ID', async () => {
    const preExistingConversation = Conversation.create({
      isGroup: false,
      participantsIds: [
        new UniqueEntityID('user-1'),
        new UniqueEntityID('user-2'),
      ],
    })
    conversationsRepository.items.push(preExistingConversation)

    const request = {
      conversationId: preExistingConversation.id.toString(),
      senderId: 'user-1',
      recipientId: 'user-2',
      content: 'Que bom!',
    }

    const result = await sut.execute(request)

    expect(result.isRight()).toBe(true)
    expect(conversationsRepository.items).toHaveLength(1)

    const conversation = conversationsRepository.items[0]!
    expect(conversation.messages).toHaveLength(1)
    expect(conversation.messages[0]!.content).toBe('Que bom!')
  })

  it('should return an error if a non-existent conversation ID is provided', async () => {
    const request = {
      conversationId: 'id-que-nao-existe',
      senderId: 'user-1',
      recipientId: 'user-2',
      content: 'Essa mensagem não será enviada',
    }

    const result = await sut.execute(request)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(conversationsRepository.items).toHaveLength(0)
  })
})
