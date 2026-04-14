import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type PresenceStatus = 'online' | 'away' | 'offline'

interface FriendPreviewProps {
  name: string
  avatarFallback: string
  status?: PresenceStatus
  selected?: boolean
  onClick?: () => void
}

const statusColors: Record<PresenceStatus, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-muted-foreground',
}

export function FriendPreview({
  name,
  avatarFallback,
  status = 'offline',
  selected,
  onClick,
}: FriendPreviewProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'border-foreground/20 flex w-full items-center gap-3 border-b p-4 text-left transition-colors delay-75',
        selected ? 'bg-accent' : 'hover:bg-accent/50',
      )}
    >
      <div className="relative">
        <Avatar className="size-10">
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            'ring-background absolute bottom-0 right-0 size-2.5 rounded-full ring-2',
            statusColors[status],
          )}
        />
      </div>
      <span className="text-foreground text-base leading-none">{name}</span>
    </button>
  )
}
