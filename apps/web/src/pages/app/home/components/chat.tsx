import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SendHorizonal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useParams } from 'react-router'

interface Message {
  id: string
  userId: string | null
  chatId: string | null
  content: string
  createdAt: Date
  updatedAt: Date | null
}

export function Chat({ messages: initialMessages }: { messages: Message[] }) {
  const { chatId, friendId } = useParams<{ chatId: string; friendId: string }>()

  const { user } = useAuth()

  const connection = useRef<null | WebSocket>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  useEffect(() => {
    if (!user) return

    setMessages(initialMessages)

    const ws = new WebSocket('ws://localhost:3333/connect')

    ws.onopen = () => {
      console.log('WebSocket conectado')
      connection.current = ws
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      console.log(data)

      setMessages((prev) => [...prev, data])
    }

    ws.onclose = () => {}
  }, [user, initialMessages])

  function sendMessage() {
    if (
      connection.current &&
      connection.current.readyState === WebSocket.OPEN &&
      message.trim()
    ) {
      connection.current.send(
        JSON.stringify({
          friendId,
          chatId,
          content: message,
        }),
      )
      setMessage('')
    } else {
      console.warn('WebSocket não está conectado ou mensagem vazia.')
    }
  }

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardContent className="flex flex-col gap-2 flex-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'w-max bg-message p-3 rounded-lg flex max-w-[400px]',
              message.userId === user?.id ? 'self-end' : 'self-start',
            )}
          >
            <span>{message.content}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex gap-3 w-full">
        {/* <form className="flex gap-3 w-full"> */}
        <Input
          placeholder="Type a message"
          name="message"
          id="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
        <Button onClick={sendMessage}>
          Send
          <SendHorizonal />
        </Button>
        {/* </form> */}
      </CardFooter>
    </Card>
  )
}
