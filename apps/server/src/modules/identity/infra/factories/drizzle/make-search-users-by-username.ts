import { DrizzleUsersRepository } from '../../repositories/drizzle/drizzle-users-repository'
import { SearchUsersByUsernameUseCase } from '@/modules/identity/application/use-cases/search-users-by-username'

export class MakeDrizzleSearchUsersByUsername {
	static make() {
		const usersRepository = new DrizzleUsersRepository()

		const searchUsersByUsernameUseCase = new SearchUsersByUsernameUseCase(usersRepository)
		return searchUsersByUsernameUseCase
	}
}
