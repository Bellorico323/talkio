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

export function SidebarHeader() {
  const [isAddNewContactDialogOpen, setIsAddNewContactDialogOpen] =
    useState(false)

  function handleAddNewContactDialog(value: boolean) {
    setIsAddNewContactDialogOpen(value)
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
            textValue="test"
            onSelect={() => handleAddNewContactDialog(true)}
          >
            <UserPlus />
            Add contact
          </DropdownMenuItem>
          <DropdownMenuItem className="p-3">
            <MessageCirclePlus />
            New chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddNewContactDialog
        open={isAddNewContactDialogOpen}
        setOpen={handleAddNewContactDialog}
      />
    </div>
  )
}
