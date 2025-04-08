import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { signOut } from '@/http/sign-out'
import { queryClient } from '@/lib/query'
import { LogOutIcon } from 'lucide-react'

export function SidebarFooter() {
  const { user } = useAuth()

  async function handleSignOut() {
    await signOut()
    queryClient.invalidateQueries({ queryKey: ['me'] })
  }

  return (
    <div className="border-t px-3 py-3 h-14 flex items-center justify-between mt-auto">
      <div className="flex gap-3">
        <Avatar className="size-9">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm">{user?.name}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => handleSignOut()}>
        <LogOutIcon className="size-4 text-destructive-foreground" />
      </Button>
    </div>
  )
}
