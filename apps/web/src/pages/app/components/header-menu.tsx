import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageCirclePlus, Plus, UserPlus } from 'lucide-react'

export function HeaderMenu() {
  return (
    <div className="border-b py-2 h-14 flex justify-between items-center pr-3">
      <strong className="text-lg">Chats</strong>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <Plus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem>
            <UserPlus />
            Add contact
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCirclePlus />
            New chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
