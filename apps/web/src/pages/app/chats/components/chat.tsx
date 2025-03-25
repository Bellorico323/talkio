import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SendHorizonal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Message {
  userId: string
  content: string
  messageId: string
}

export function Chat() {
  const connection = useRef<null | WebSocket>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
  ])

  useEffect(() => {
    const socket = new WebSocket('http://localhost:3333/chat')

    connection.current = socket

    const handleOpen = () => {
      socket.send('Connection established')
    }

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)

      console.log('Mensagem recebida do servidor:', message)
      if (message.type !== 'validation') {
        setMessages((prevMessages) => [...prevMessages, JSON.parse(event.data)])
      }
    }

    socket.addEventListener('open', handleOpen)
    socket.addEventListener('message', handleMessage)

    return () => {
      if (connection.current instanceof WebSocket) {
        connection.current.removeEventListener('open', handleOpen)
        connection.current.removeEventListener('message', handleMessage)
        connection.current.close()
        connection.current = null
      }
    }
  }, [])

  function sendMessage() {
    if (
      connection.current &&
      connection.current.readyState === WebSocket.OPEN
    ) {
      connection.current.send(
        JSON.stringify({
          userId: '1',
          content: message,
        }),
      )
      setMessage('')
    } else {
      console.warn('WebSocket não está conectado.')
    }
  }

  return (
    <Card className="shadow-xs h-full flex flex-col">
      <CardContent className="flex flex-col gap-2 flex-1">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={cn(
              'w-max bg-message p-3 rounded-lg flex max-w-[400px]',
              message.userId === '1' ? 'self-end' : 'self-start',
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
