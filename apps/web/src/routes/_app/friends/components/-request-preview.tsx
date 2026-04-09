import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface RequestPreviewProps {
  name: string
  avatarFallback: string
  direction: 'received' | 'sent'
  selected?: boolean
  onClick?: () => void
}

export function RequestPreview({
  name,
  avatarFallback,
  direction,
  selected,
  onClick,
}: RequestPreviewProps) {
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
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-foreground text-base leading-none">{name}</span>
        <span
          className={cn(
            'text-xs leading-none',
            direction === 'received'
              ? 'text-primary'
              : 'text-muted-foreground',
          )}
        >
          {direction === 'received' ? 'Received' : 'Sent'}
        </span>
      </div>
    </button>
  )
}
