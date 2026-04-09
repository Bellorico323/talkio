import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { ChatPreview } from './components/-chat-preview'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Chat } from './components/-chat'

export const Route = createFileRoute('/_app/chats/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="grid h-full grid-cols-[320px_1fr]">
			<div className="border-foreground/20 flex h-full min-h-0 flex-col gap-3 border-r">
				<div className="flex flex-col gap-3 p-4">
					<h1 className="font-heading text-2xl">Chats</h1>

					<IconInputRoot>
						<Search className="text-muted-foreground size-4" />
						<IconInputControl placeholder="People, groups and messages" />
					</IconInputRoot>
				</div>

				<ScrollArea className="border-foreground/20 min-h-150 flex-1 border-t">
					<ChatPreview />
				</ScrollArea>
			</div>
			<Chat />
		</div>
	)
}
