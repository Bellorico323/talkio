import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { sendFriendshipRequestController } from './controllers/send-friendship-request.controller'
import { acceptFriendshipController } from './controllers/accept-friendship-request.controller'
import { rejectFriendshipController } from './controllers/reject-friendship-request.controller'

export class FriendShipModule implements AppModule {
  async routes(app: FastifyInstance) {
    app.register(sendFriendshipRequestController)
    app.register(acceptFriendshipController)
    app.register(rejectFriendshipController)
  }
}

export const friendshipModule = new FriendShipModule()
