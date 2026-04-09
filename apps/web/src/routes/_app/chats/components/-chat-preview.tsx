import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCheck } from 'lucide-react'

export function ChatPreview() {
  return (
    <div className="border-foreground/20 hover:bg-accent/50 flex items-center justify-between gap-4 border-b p-4 transition-colors delay-75">
      <Avatar className="size-12">
        <AvatarImage
          src="https://github.com/Bellorico323.png"
          alt="@Bellorico"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex grow flex-col gap-1.5">
        <div className="inline-flex w-full items-center justify-between">
          <span className="text-foreground text-base leading-none">
            Murillo Orico
          </span>

          <span className="text-muted-foreground text-sm leading-none">
            9:52
          </span>
        </div>

        <div className="inline-flex w-full items-center justify-between">
          <span className="text-muted-foreground text-sm leading-none">
            Hello, how are you?
          </span>
          <CheckCheck className="size-4 text-emerald-500" />
        </div>
      </div>
    </div>
  )
}
