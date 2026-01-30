import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { NotAllowedError } from '@/shared/domain/errors/not-allowed-error'
import { InMemoryFriendshipsRepository } from 'test/repositories/friendship/in-memory-friendships-repository'
import { makeFriendship } from 'test/factories/make-friendship'
import { RejectFriendshipRequestUseCase } from '../reject-friendship-request'

let friendshipsRepository: InMemoryFriendshipsRepository
let sut: RejectFriendshipRequestUseCase

beforeEach(() => {
  friendshipsRepository = new InMemoryFriendshipsRepository()
  sut = new RejectFriendshipRequestUseCase(friendshipsRepository)
})

describe('Reject Friendship Request Use Case', () => {
  it('should allow the addressee to reject a pending friendship request', async () => {
    const friendship = makeFriendship({
      requesterId: new UniqueEntityID('user-1'),
      addresseeId: new UniqueEntityID('user-2'),
    })
    friendshipsRepository.items.push(friendship)

    const result = await sut.execute({
      userId: 'user-2',
      friendshipId: friendship.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(friendshipsRepository.items).toHaveLength(0)
    if (result.isRight()) {
      expect(result.value.friendship.status).toBe('rejected')
    }
  })

  it('should not allow a user other than the addressee to reject the request', async () => {
    const friendship = makeFriendship({
      requesterId: new UniqueEntityID('user-1'),
      addresseeId: new UniqueEntityID('user-2'),
    })
    friendshipsRepository.items.push(friendship)

    const result = await sut.execute({
      userId: 'user-3',
      friendshipId: friendship.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(friendshipsRepository.items).toHaveLength(1)
    expect(friendshipsRepository.items[0]!.status).toBe('pending')
  })

  it('should return ResourceNotFoundError if the friendship does not exist', async () => {
    const result = await sut.execute({
      userId: 'user-2',
      friendshipId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
