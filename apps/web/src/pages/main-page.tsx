import { MessageCircleCodeIcon } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggle'
import { Conversation } from './components/conversation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Chat } from './components/chat'

export function MainPage() {
  return (
    <div className="min-h-screen p-10 bg-muted antialiased">
      <div className="flex flex-col max-w-[1220px] mx-auto bg-background text-foreground rounded-lg">
        <header className="py-3 px-6 flex justify-between border-b">
          <div className="flex gap-1 items-center">
            <MessageCircleCodeIcon />
            <span>Talk.io</span>
          </div>
          <ThemeToggle />
        </header>
        <div className="w-full py-3 px-6 grid grid-cols-[300px_1fr]">
          <aside className="flex flex-col gap-6 border-r">
            <div className="border-b py-2 h-14">
              <strong className="text-lg">Chats</strong>
            </div>
            <ul className="flex flex-col space-y-3">
              <Conversation />
            </ul>
          </aside>

          <div className="">
            <div className=" border-b px-6 py-2 h-14 flex gap-3">
              <Avatar className="size-9">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm">John Doe</span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
            <div className="pl-6 py-4">
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
