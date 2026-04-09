import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface FriendPreviewProps {
  name: string
  avatarFallback: string
  selected?: boolean
  onClick?: () => void
}

export function FriendPreview({
  name,
  avatarFallback,
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
      <Avatar className="size-10">
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
      <span className="text-foreground text-base leading-none">{name}</span>
    </button>
  )
}
