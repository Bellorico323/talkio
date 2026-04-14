import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { FriendPreview } from './components/-friend-preview'
import { FriendsPanel } from './components/-friends-panel'

export const Route = createFileRoute('/_app/friends/')({
  component: RouteComponent,
})

const MOCK_FRIENDS = [
  { id: '1', name: 'Alice Souza', avatarFallback: 'AS', status: 'online' as const },
  { id: '2', name: 'Bob Lima', avatarFallback: 'BL', status: 'away' as const },
  { id: '3', name: 'Carol Mendes', avatarFallback: 'CM', status: 'offline' as const },
  { id: '4', name: 'Diego Rocha', avatarFallback: 'DR', status: 'online' as const },
]

const MOCK_REQUESTS = [
  { id: '5', name: 'Eve Torres', avatarFallback: 'ET', direction: 'received' as const },
  { id: '6', name: 'Felipe Nunes', avatarFallback: 'FN', direction: 'received' as const },
  {
    id: '7',
    name: 'Gabriela Pinto',
    avatarFallback: 'GP',
    direction: 'sent' as const,
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]

function RouteComponent() {
  const [search, setSearch] = useState('')

  const filteredFriends = MOCK_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <div className="border-foreground/20 flex h-full min-h-0 flex-col gap-3 border-r">
        <div className="flex flex-col gap-3 p-4">
          <h1 className="font-heading text-2xl">Friends</h1>
          <IconInputRoot>
            <Search className="text-muted-foreground size-4" />
            <IconInputControl
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </IconInputRoot>
        </div>

        <ScrollArea className="border-foreground/20 min-h-0 flex-1 border-t">
          {filteredFriends.map((friend) => (
            <FriendPreview
              key={friend.id}
              name={friend.name}
              avatarFallback={friend.avatarFallback}
              status={friend.status}
            />
          ))}
        </ScrollArea>
      </div>

      {/* Main panel */}
      <ScrollArea className="h-full">
        <FriendsPanel requests={MOCK_REQUESTS} />
      </ScrollArea>
    </div>
  )
}
