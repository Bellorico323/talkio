import { FastifyInstance } from 'fastify'

export interface AppModule {
  /** Configura os handlers/event subscribers */
  execute?(): void | Promise<void>

  /** Plugin de rotas para o Fastify */
  routes?(app: FastifyInstance): Promise<void>
}
