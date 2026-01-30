import { beforeEach, describe, expect, it } from 'vitest'

import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { NotAllowedError } from '@/shared/domain/errors/not-allowed-error'
import { InMemoryFriendshipsRepository } from 'test/repositories/friendship/in-memory-friendships-repository'
import { makeFriendship } from 'test/factories/make-friendship'
import { AcceptFriendshipRequestUseCase } from '../accept-friendship-request'

let friendshipsRepository: InMemoryFriendshipsRepository
let sut: AcceptFriendshipRequestUseCase

beforeEach(() => {
  friendshipsRepository = new InMemoryFriendshipsRepository()
  sut = new AcceptFriendshipRequestUseCase(friendshipsRepository)
})

describe('Accept Friendship Request Use Case', () => {
  it('should allow the addressee to accept a pending friendship request', async () => {
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

    const stored = friendshipsRepository.items[0]!
    expect(stored.status).toBe('accepted')
    expect(stored.acceptedAt).toBeInstanceOf(Date)
  })

  it('should not allow a user other than the addressee to accept the request', async () => {
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
