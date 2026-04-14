import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { Check, Clock, UserPlus, X } from 'lucide-react'

interface FriendRequest {
  id: string
  name: string
  avatarFallback: string
  direction: 'received' | 'sent'
  sentAt?: Date
}

interface FriendsPanelProps {
  requests: FriendRequest[]
}

function formatPendingTime(sentAt: Date): string {
  const diffMs = Date.now() - sentAt.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

export function FriendsPanel({ requests }: FriendsPanelProps) {
  const received = requests.filter((r) => r.direction === 'received')
  const sent = requests.filter((r) => r.direction === 'sent')

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-lg font-semibold">Add Friend</h2>
        <div className="flex gap-2">
          <IconInputRoot>
            <UserPlus className="text-muted-foreground size-4 shrink-0" />
            <IconInputControl placeholder="Search by username..." />
          </IconInputRoot>
          <Button className="shrink-0">Send Request</Button>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">
          Received ({received.length})
        </h2>

        {received.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending incoming requests.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {received.map((req) => (
              <div
                key={req.id}
                className="border-foreground/10 flex items-center gap-3 rounded-2xl border p-3"
              >
                <Avatar className="size-10">
                  <AvatarFallback>{req.avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="text-foreground flex-1 text-base leading-none">
                  {req.name}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1">
                    <Check className="size-3.5" />
                    Accept
                  </Button>
                  <Button variant="destructive" size="sm" className="gap-1">
                    <X className="size-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">
          Sent ({sent.length})
        </h2>

        {sent.length === 0 ? (
          <p className="text-muted-foreground text-sm">No outgoing pending requests.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sent.map((req) => (
              <div
                key={req.id}
                className="border-foreground/10 flex items-center gap-3 rounded-2xl border p-3"
              >
                <Avatar className="size-10">
                  <AvatarFallback>{req.avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="text-foreground flex-1 text-base leading-none">
                  {req.name}
                </span>
                <div className="flex items-center gap-2">
                  {req.sentAt && (
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="size-3.5" />
                      {formatPendingTime(req.sentAt)}
                    </span>
                  )}
                  <Button variant="ghost" size="sm" className="gap-1">
                    <X className="size-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
