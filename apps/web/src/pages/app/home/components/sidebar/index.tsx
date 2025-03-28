import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatPreview } from './chat-preview'
import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

interface GetChatsResponse {
  chats: {
    friendId: string
    friendName: string
    avatarUrl: string
    chatId: string
  }[]
}

export function Sidebar() {
  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await api.get<GetChatsResponse>('chats')
      return (await response.json()).chats
    },
  })

  return (
    <aside className="flex flex-col border-r h-full gap-2">
      <SidebarHeader />
      <ScrollArea className="flex-1 max-h-[70vh] pr-4">
        {chats &&
          chats.map((chat) => <ChatPreview key={chat.chatId} data={chat} />)}
      </ScrollArea>
      <SidebarFooter />
    </aside>
  )
}
