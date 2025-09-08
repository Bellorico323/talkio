export interface MessagePayloads {
  ping: { text: string }
  pong: { text: string }
  'friendship.sendRequest': {
    body: {
      sender: string
      content: string
    }
  }
  'chat.directMessage': {
    body: {
      conversationId?: string
      senderId: string
      recipientId: string
      content: string
    }
  }
}

export type MessageOptions = {
  [K in keyof MessagePayloads]: {
    type: K
    payload: MessagePayloads[K]
  }
}[keyof MessagePayloads]
