import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { searchUsersByUsernameController } from './controllers/search-user-by-username.controller'

class IdentityModule implements AppModule {
	async routes(app: FastifyInstance): Promise<void> {
		app.register(searchUsersByUsernameController)
	}
}

export const identityModule = new IdentityModule()
