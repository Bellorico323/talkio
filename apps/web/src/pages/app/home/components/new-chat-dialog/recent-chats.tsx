import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentChats() {
  return (
    <div className="rounded bg-message">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          className="border-b border-accent py-1.5 flex gap-2.5 items-center last:border-none hover:bg-input/30 px-3"
          key={idx}
        >
          <Avatar className="size-8">
            <AvatarImage src={'https://github.com/Bellorico323.png'} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <p>Murillo Orico</p>
        </div>
      ))}
    </div>
  )
}
