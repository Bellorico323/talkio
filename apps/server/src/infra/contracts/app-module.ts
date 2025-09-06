import { FastifyInstance } from 'fastify'

export interface AppModule {
  /** Configura os handlers/event subscribers */
  registerDomainHandlers?(app: FastifyInstance): void | Promise<void>

  /** Configura as mensagens do ws gateway */
  registerWsHandlers?(app: FastifyInstance): void | Promise<void>

  /** Plugin de rotas para o Fastify */
  routes?(app: FastifyInstance): Promise<void>
}
