import { WatchedList } from '@/shared/domain/entities/watched-list'
import { Message } from './message'

export class MessagesList extends WatchedList<Message> {
  compareItems(a: Message, b: Message): boolean {
    return a.id.equals(b.id)
  }
}
