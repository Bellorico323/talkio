import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fetchRecentChats } from '@/http/fetch-recent-chats'
import { useQuery } from '@tanstack/react-query'

export function RecentChats() {
  const { data: recentChats } = useQuery({
    queryKey: ['recent-chats'],
    queryFn: async () => {
      const response = await fetchRecentChats()

      return response.recentChats
    },
  })

  return (
    <div className="rounded bg-message">
      {recentChats?.map((item) => (
        <div
          className="border-b border-accent py-1.5 flex gap-2.5 items-center last:border-none hover:bg-input/30 px-3 hover:cursor-pointer"
          key={item.friendId}
        >
          <Avatar className="size-8">
            {item.friendAvatarUrl && <AvatarImage src={item.friendAvatarUrl} />}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <p>{item.friendName}</p>
        </div>
      ))}
    </div>
  )
}
