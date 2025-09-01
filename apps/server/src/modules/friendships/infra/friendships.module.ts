import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { sendFriendshipRequestController } from './controllers/send-friendship-request.controller'

export class FriendShipModule implements AppModule {
  async routes(app: FastifyInstance) {
    app.post('/friendships', sendFriendshipRequestController)
  }
}

export const friendshipModule = new FriendShipModule()
