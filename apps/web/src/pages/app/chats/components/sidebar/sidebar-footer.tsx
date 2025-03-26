import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { LogOutIcon } from 'lucide-react'

interface GetProfileResponse {
  user: {
    id: string
    name: string
    email: string
    phone: string
    avatarUrl: string
    createdAt: string
    updatedAt: string
  }
}

export function SidebarFooter() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await api.get<GetProfileResponse>('me')
      const user = (await response.json()).user

      return user
    },
  })

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
      <Button variant="ghost" size="sm">
        <LogOutIcon className="size-4 text-destructive-foreground" />
      </Button>
    </div>
  )
}
