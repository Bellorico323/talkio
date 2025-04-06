import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNavigate } from 'react-router'

interface ChatPreviewProps {
  data: {
    friendId: string
    friendName: string
    avatarUrl: string
    chatId: string
  }
}

export function ChatPreview({ data }: ChatPreviewProps) {
  const navigate = useNavigate()

  return (
    <li
      className="flex items-center gap-3 hover:bg-muted rounded-lg p-2 hover:cursor-pointer"
      onClick={() => navigate(`/${data.chatId}/${data.friendId}`)}
    >
      <Avatar className="size-10">
        <AvatarImage src={data.avatarUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-base font-medium">{data.friendName}</span>
        <span className="text-sm text-neutral-500">Minha ultima mensagem</span>
      </div>
    </li>
  )
}
