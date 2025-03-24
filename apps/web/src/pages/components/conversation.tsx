import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Conversation() {
  return (
    <li className="flex items-center gap-3">
      <Avatar className="size-10">
        <AvatarImage src="https://github.com/Bellorico323.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-base font-medium">Murillo Orico</span>
        <span className="text-sm text-neutral-500">Minha ultima mensagem</span>
      </div>
    </li>
  )
}
