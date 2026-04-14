import { User } from '../../domain/entities/user'

export interface SearchUsersParams {
	username?: string
	page: number
	limit: number
}

export interface SearchUsersResult {
	users: User[]
	total: number
}

export interface UsersRepository {
	findById(userId: string): Promise<User | null>
	searchByUsername(params: SearchUsersParams): Promise<SearchUsersResult>
}
