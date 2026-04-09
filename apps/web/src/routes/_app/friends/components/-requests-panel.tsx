import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Check, Clock, X } from 'lucide-react'

interface FriendRequest {
  id: string
  name: string
  avatarFallback: string
  direction: 'received' | 'sent'
}

interface RequestsPanelProps {
  requests: FriendRequest[]
}

export function RequestsPanel({ requests }: RequestsPanelProps) {
  const received = requests.filter((r) => r.direction === 'received')
  const sent = requests.filter((r) => r.direction === 'sent')

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">
          Received ({received.length})
        </h2>

        {received.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No pending incoming requests.
          </p>
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
          <p className="text-muted-foreground text-sm">
            No outgoing pending requests.
          </p>
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
                  <Clock className="text-muted-foreground size-4" />
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
