import { Redis } from 'ioredis'

type MessageHandler = (channel: string, message: string) => void

export class RedisPubSub {
  private publisher: Redis
  private subscriber: Redis

  constructor(redisUrl: string) {
    this.publisher = new Redis(redisUrl)
    this.subscriber = new Redis(redisUrl)
  }

  async publish(channel: string, message: Record<string, unknown>) {
    await this.publisher.publish(channel, JSON.stringify(message))
  }

  async subscribe(channel: string, handler: MessageHandler) {
    await this.subscriber.subscribe(channel)
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        handler(receivedChannel, message)
      }
    })
  }

  async unsubscribe(channel: string) {
    await this.subscriber.unsubscribe(channel)
  }

  async disconnect() {
    this.publisher.disconnect()
    this.subscriber.disconnect()
  }
}
