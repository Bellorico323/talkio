import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'

export function SidebarFooter() {
  return (
    <div className="border-t px-3 py-3 h-14 flex items-center justify-between mt-auto">
      <div className="flex gap-3">
        <Avatar className="size-9">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm">Me</span>
          <span className="text-xs text-muted-foreground">
            mabo.orico@gmail
          </span>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        <LogOutIcon className="size-4 text-destructive-foreground" />
      </Button>
    </div>
  )
}
