import { Conversation } from "./conversation"
import { SidebarFooter } from "./sidebar-footer"
import { SidebarHeader } from "./sidebar-header"

export function Sidebar() {
  return (
          <aside className="flex flex-col gap-6 border-r h-full">
            <SidebarHeader />
            <ul className="flex flex-col space-y-2 h-fit">
              <Conversation />
              <Conversation />
              <Conversation />
              <Conversation />
            </ul>
            <SidebarFooter />
          </aside>
  )
}