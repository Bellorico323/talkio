import { Either, right } from '@/shared/domain/either'
import { User } from '../../domain/entities/user'
import { UsersRepository } from '../repositories/users-repository'

interface SearchUsersByUsernameUseCaseRequest {
	username?: string
	page?: number
	limit?: number
}

type SearchUsersByUsernameUseCaseResponse = Either<
	null,
	{
		users: User[]
		total: number
	}
>

export class SearchUsersByUsernameUseCase {
	constructor(private usersRepository: UsersRepository) { }

	async execute({
		username,
		page = 1,
		limit = 20,
	}: SearchUsersByUsernameUseCaseRequest): Promise<SearchUsersByUsernameUseCaseResponse> {
		const { users, total } = await this.usersRepository.searchByUsername({
			username,
			page,
			limit,
		})

		return right({ users, total })
	}
}
