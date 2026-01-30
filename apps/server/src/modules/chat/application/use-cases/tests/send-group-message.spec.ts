import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { InMemoryConversationsRepository } from 'test/repositories/chat/in-memory-conversations-repository'
import { Conversation } from '@/modules/chat/domain/entities/conversation'
import { ConversatinIsNotGroupError } from '../errors/conversation-is-not-group-error'
import { NotParticipantError } from '../errors/not-participant-error'
import { SendGroupMessageUseCase } from '../send-group-message'

let conversationsRepository: InMemoryConversationsRepository
let sut: SendGroupMessageUseCase // System Under Test

beforeEach(() => {
  conversationsRepository = new InMemoryConversationsRepository()
  sut = new SendGroupMessageUseCase(conversationsRepository)
})

describe('Send Group Message Use Case', () => {
  it('should be able to send a message to a group conversation', async () => {
    const groupConversation = Conversation.create({
      isGroup: true,
      title: 'Grupo Teste',
      participantsIds: [
        new UniqueEntityID('user-sender'),
        new UniqueEntityID('user-other'),
      ],
    })
    conversationsRepository.items.push(groupConversation)

    const request = {
      senderId: 'user-sender',
      conversationId: groupConversation.id.toString(),
      content: 'Mensagem para o grupo!',
    }

    const result = await sut.execute(request)

    expect(result.isRight()).toBe(true)

    const updatedConversation = conversationsRepository.items[0]!
    expect(updatedConversation.messages.currentItems).toHaveLength(1)
    expect(updatedConversation.messages.currentItems[0]!.content).toBe(
      'Mensagem para o grupo!'
    )
    expect(updatedConversation.messages.currentItems[0]!.senderId.toString()).toBe(
      'user-sender'
    )
  })

  it('should return an error if the conversation does not exist', async () => {
    const request = {
      senderId: 'user-sender',
      conversationId: 'non-existent-group-id',
      content: 'Esta mensagem nunca será enviada',
    }

    const result = await sut.execute(request)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the conversation is not a group', async () => {
    const directConversation = Conversation.create({
      isGroup: false,
      participantsIds: [
        new UniqueEntityID('user-sender'),
        new UniqueEntityID('user-other'),
      ],
    })
    conversationsRepository.items.push(directConversation)

    const request = {
      senderId: 'user-sender',
      conversationId: directConversation.id.toString(),
      content: 'Tentando enviar para uma conversa direta',
    }

    const result = await sut.execute(request)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConversatinIsNotGroupError)
  })

  it('should return an error if the sender is not a participant of the group', async () => {
    const groupConversation = Conversation.create({
      isGroup: true,
      title: 'Grupo Exclusivo',
      participantsIds: [
        new UniqueEntityID('user-member-1'),
        new UniqueEntityID('user-member-2'),
      ],
    })
    conversationsRepository.items.push(groupConversation)

    const request = {
      senderId: 'user-intruder',
      conversationId: groupConversation.id.toString(),
      content: 'Olá, pessoal?',
    }

    const result = await sut.execute(request)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotParticipantError)
  })
})
