import { Either, right } from '@/shared/domain/either'
import { User } from '../../domain/entities/user'
import { UsersRepository } from '../repositories/users-repository'

interface SearchUsersByUsernameUseCaseRequest {
	username: string
}

type SearchUsersByUsernameUseCaseResponse = Either<
	null,
	{
		users: User[]
	}
>

export class SearchUsersByUsernameUseCase {
	constructor(private usersRepository: UsersRepository) { }

	async execute({
		username,
	}: SearchUsersByUsernameUseCaseRequest): Promise<SearchUsersByUsernameUseCaseResponse> {
		const users = await this.usersRepository.searchByUsername(username)


		return right({ users })
	}
}
