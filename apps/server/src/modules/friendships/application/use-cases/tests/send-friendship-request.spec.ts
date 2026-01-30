import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryFriendshipsRepository } from 'test/repositories/friendship/in-memory-friendships-repository'
import { SendFriendshipRequestUseCase } from '../send-friendship-request'
import { FriendshipToYourselfError } from '../errors/friendship-to-yourself-error'
import { FriendShipAlreadyExistsError } from '../errors/friendship-already-exists-error'
import { makeFriendship } from 'test/factories/make-friendship'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

let friendshipsRepository: InMemoryFriendshipsRepository
let sut: SendFriendshipRequestUseCase

beforeEach(() => {
  friendshipsRepository = new InMemoryFriendshipsRepository()
  sut = new SendFriendshipRequestUseCase(friendshipsRepository)
})

describe('Send Friendship Request Use Case', () => {
  it('should be able to send a friendship request', async () => {
    const request = {
      requesterId: new UniqueEntityID('user-1'),
      addresseeId: new UniqueEntityID('user-2'),
    }

    const result = await sut.execute({
      addresseeId: request.addresseeId.toString(),
      requesterId: request.requesterId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(friendshipsRepository.items).toHaveLength(1)
  })

  it('should not allow sending a friendship request to yourself', async () => {
    const request = {
      requesterId: new UniqueEntityID('user-1'),
      addresseeId: new UniqueEntityID('user-1'),
    }

    const result = await sut.execute({
      addresseeId: request.addresseeId.toString(),
      requesterId: request.requesterId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(FriendshipToYourselfError)
  })

  it('should not allow sending a friendship request if one already exists', async () => {
    const existingFriendship = makeFriendship({
      requesterId: new UniqueEntityID('user-1'),
      addresseeId: new UniqueEntityID('user-2'),
    })
    friendshipsRepository.items.push(existingFriendship)

    const request = {
      requesterId: 'user-1',
      addresseeId: 'user-2',
    }

    const result = await sut.execute(request)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(FriendShipAlreadyExistsError)
  })
})
