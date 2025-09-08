import { MessageOptions, MessagePayloads } from '../websocket/payloads'

export interface MessageGateway {
  onMessage<P extends keyof MessagePayloads>(
    type: P,
    handler: (userId: string, payload: MessagePayloads[P]) => void
  ): void
  broadcast(message: any): void
  sendToUser(userId: string, message: MessageOptions): void
}
