import { beforeEach, describe, expect, it } from 'vitest'
import { SearchUsersByUsernameUseCase } from '../search-users-by-username'
import { InMemoryUsersRepository } from 'test/repositories/identity/in-memory-users-reporitory'
import { makeUser } from 'test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: SearchUsersByUsernameUseCase

beforeEach(() => {
	usersRepository = new InMemoryUsersRepository()
	sut = new SearchUsersByUsernameUseCase(usersRepository)
})

describe('Search User Use Case', () => {
	it('should be able to search users by partial username', async () => {
		for (let i = 0; i <= 20; i++) {
			const user = makeUser({ username: `@user_${i}` })
			usersRepository.items.push(user)
		}

		const userToSearch1 = makeUser({
			username: "@johndoe01",
		})
		usersRepository.items.push(userToSearch1);

		const userToSearch2 = makeUser({
			username: "@johndoe02",
		})
		usersRepository.items.push(userToSearch2);


		const request = {
			username: "john",
		}

		const result = await sut.execute(request)

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(2)
		expect(result.value?.users).toEqual(expect.arrayContaining([
			expect.objectContaining({
				username: "@johndoe01"
			}),
			expect.objectContaining({
				username: "@johndoe02"
			})
		]
		))
	})

	it('should return an empty list when no users match the username', async () => {
		for (let i = 0; i < 5; i++) {
			usersRepository.items.push(makeUser({ username: `@user${i}` }))
		}

		const result = await sut.execute({ username: 'nonexistent' })

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(0)
	})

	it('should return an empty list when the repository is empty', async () => {
		const result = await sut.execute({ username: 'john' })

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(0)
	})

	it('should be case-insensitive when searching', async () => {
		usersRepository.items.push(makeUser({ username: '@JohnDoe' }))
		usersRepository.items.push(makeUser({ username: '@JOHNDOE' }))
		usersRepository.items.push(makeUser({ username: '@johndoe' }))

		const result = await sut.execute({ username: 'john' })

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(3)
	})

	it('should return a user when searching by exact username', async () => {
		const user = makeUser({ username: '@exactmatch' })
		usersRepository.items.push(user)
		usersRepository.items.push(makeUser({ username: '@other' }))

		const result = await sut.execute({ username: '@exactmatch' })

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(1)
		expect(result.value?.users[0]?.username).toBe('@exactmatch')
	})

	it('should not return users whose usernames do not contain the search term', async () => {
		usersRepository.items.push(makeUser({ username: '@alice' }))
		usersRepository.items.push(makeUser({ username: '@bob' }))
		usersRepository.items.push(makeUser({ username: '@charlie' }))

		const result = await sut.execute({ username: 'bob' })

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(1)
		expect(result.value?.users[0]?.username).toBe('@bob')
	})

	it('should return all users when the search term matches all of them', async () => {
		usersRepository.items.push(makeUser({ username: '@dev_alice' }))
		usersRepository.items.push(makeUser({ username: '@dev_bob' }))
		usersRepository.items.push(makeUser({ username: '@dev_charlie' }))

		const result = await sut.execute({ username: 'dev' })

		expect(result.isRight()).toBe(true)
		expect(result.value?.users).toHaveLength(3)
	})
})
