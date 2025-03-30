import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import dayjs from '@/lib/dayjs'
import { AddContactForm } from './add-contact-form'

interface AddNewContactDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

interface PendingInvitesResponse {
  pendingInvites: {
    id: string
    createdAt: Date
    friend: {
      name: string
      avatarUrl: string | null
    }
  }[]
}

export function AddNewContactDialog({
  open,
  setOpen,
}: AddNewContactDialogProps) {
  const { data: pendingInvites } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: async () => {
      return api.get<PendingInvitesResponse>('friendships/invites').json()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
          <DialogDescription>Send invite to add a new friend</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <AddContactForm />

          <div>
            <p className="text-md font-semibold mb-4">Pending invites</p>

            <ScrollArea>
              <div className="flex flex-col gap-2 max-h-[272px] pr-4">
                {pendingInvites?.pendingInvites.map((item) => (
                  <div
                    className="flex items-center bg-input/40 py-2 px-4 rounded-md justify-between"
                    key={item.id}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="size-8">
                        <AvatarImage src={item.friend.avatarUrl ?? undefined} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {item.friend.name}
                      </span>
                    </div>

                    <span className="text-sm text-secondary-foreground">
                      {dayjs(item.createdAt).fromNow()}
                    </span>

                    <div className="flex items-center gap-4">
                      <Badge variant="warning">Pending</Badge>

                      <Button size="sm" variant="ghost">
                        <X />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
