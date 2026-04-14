import { User } from '../../domain/entities/user'

export interface UsersRepository {
	findById(userId: string): Promise<User | null>
	searchByUsername(username: string): Promise<User[]>
}
