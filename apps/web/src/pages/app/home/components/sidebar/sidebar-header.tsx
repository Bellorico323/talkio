import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageCirclePlus, Plus, UserPlus } from 'lucide-react'
import { AddNewContactDialog } from '../add-contact-dialog'
import { useState } from 'react'
import { NewChatDialog } from '../new-chat-dialog'

export function SidebarHeader() {
  const [isAddNewContactDialogOpen, setIsAddNewContactDialogOpen] =
    useState(false)

  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)

  function handleAddNewContactDialog(value: boolean) {
    setIsAddNewContactDialogOpen(value)
  }

  function handleNewChatDialog(value: boolean) {
    setIsNewChatDialogOpen(value)
  }

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
          <DropdownMenuItem
            className="p-3"
            onSelect={() => handleAddNewContactDialog(true)}
          >
            <UserPlus />
            Add contact
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-3"
            onSelect={() => handleNewChatDialog(true)}
          >
            <MessageCirclePlus />
            New chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddNewContactDialog
        open={isAddNewContactDialogOpen}
        setOpen={handleAddNewContactDialog}
      />

      <NewChatDialog open={isNewChatDialogOpen} setOpen={handleNewChatDialog} />
    </div>
  )
}
