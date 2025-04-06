import { MessageCircleCodeIcon } from 'lucide-react'
import { ThemeToggle } from '../../../components/theme/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Chat } from './components/chat'
import { Sidebar } from './components/sidebar'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getChatMessages } from '@/http/get-chat-messages'
import { getFriendDetails } from '@/http/get-friend-details'

export function MainPage() {
  const { chatId, friendId } = useParams<{ chatId: string; friendId: string }>()

  const { data: messagesResponse } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      const response = await getChatMessages({ chatId })

      return response
    },
    enabled: !!chatId,
  })

  const { data: friendResponse } = useQuery({
    queryKey: ['friend-details', friendId],
    queryFn: async () => {
      const response = await getFriendDetails({
        friendId,
      })

      return response
    },
    enabled: !!friendId,
  })

  return (
    <div className="h-screen p-10 bg-muted antialiased">
      <div className="flex flex-col max-w-[1220px] mx-auto bg-background text-foreground rounded-lg h-full">
        <header className="py-3 px-6 flex justify-between border-b">
          <div className="flex gap-1 items-center">
            <MessageCircleCodeIcon />
            <span>Talk.io</span>
          </div>
          <ThemeToggle />
        </header>
        <div className="w-full py-3 px-6 grid grid-cols-[300px_1fr] h-full">
          <Sidebar />

          {messagesResponse ? (
            <div className="flex flex-col h-full">
              <div className=" border-b px-6 py-3 h-14 flex gap-3">
                <Avatar className="size-9">
                  <AvatarImage
                    src={friendResponse?.friend?.friendAvatarUrl ?? undefined}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {friendResponse?.friend?.friendName}
                  </span>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <div className="pl-6 pt-4 h-full">
                <Chat messages={messagesResponse.messages} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              Who you talking to today ?
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
