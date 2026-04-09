import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { FriendPreview } from './components/-friend-preview'
import { FriendsPanel } from './components/-friends-panel'
import { RequestPreview } from './components/-request-preview'
import { RequestsPanel } from './components/-requests-panel'

export const Route = createFileRoute('/_app/friends/')({
  component: RouteComponent,
})

type Tab = 'friends' | 'requests'

const MOCK_FRIENDS = [
  { id: '1', name: 'Alice Souza', avatarFallback: 'AS' },
  { id: '2', name: 'Bob Lima', avatarFallback: 'BL' },
  { id: '3', name: 'Carol Mendes', avatarFallback: 'CM' },
  { id: '4', name: 'Diego Rocha', avatarFallback: 'DR' },
]

const MOCK_REQUESTS = [
  { id: '5', name: 'Eve Torres', avatarFallback: 'ET', direction: 'received' as const },
  { id: '6', name: 'Felipe Nunes', avatarFallback: 'FN', direction: 'received' as const },
  { id: '7', name: 'Gabriela Pinto', avatarFallback: 'GP', direction: 'sent' as const },
]

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('friends')
  const [search, setSearch] = useState('')

  const filteredFriends = MOCK_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredRequests = MOCK_REQUESTS.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="grid h-full grid-cols-[320px_1fr]">
      {/* Sidebar */}
      <div className="border-foreground/20 flex h-full min-h-0 flex-col gap-3 border-r">
        <div className="flex flex-col gap-3 p-4">
          <h1 className="font-heading text-2xl">Friends</h1>

          {/* Tab switcher */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 rounded-2xl px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
            >
              Friends ({MOCK_FRIENDS.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 rounded-2xl px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
            >
              Requests ({MOCK_REQUESTS.length})
            </button>
          </div>

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
          {activeTab === 'friends'
            ? filteredFriends.map((friend) => (
                <FriendPreview
                  key={friend.id}
                  name={friend.name}
                  avatarFallback={friend.avatarFallback}
                />
              ))
            : filteredRequests.map((req) => (
                <RequestPreview
                  key={req.id}
                  name={req.name}
                  avatarFallback={req.avatarFallback}
                  direction={req.direction}
                />
              ))}
        </ScrollArea>
      </div>

      {/* Main panel */}
      <ScrollArea className="h-full">
        {activeTab === 'friends' ? (
          <FriendsPanel friends={filteredFriends} />
        ) : (
          <RequestsPanel requests={filteredRequests} />
        )}
      </ScrollArea>
    </div>
  )
}
