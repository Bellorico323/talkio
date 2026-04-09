import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInput } from './-chat-input'

const MOCK_MESSAGES = [
	{ id: 1, text: 'Oi! Tudo bem?', mine: false, time: '14:20' },
	{ id: 2, text: 'Tudo ótimo! E você?', mine: true, time: '14:21' },
	{
		id: 3,
		text: 'Bem também! Viu o projeto novo?',
		mine: false,
		time: '14:21',
	},
	{ id: 4, text: 'Vi sim, ficou muito bom!', mine: true, time: '14:22' },
	{
		id: 5,
		text: 'Obrigado! Ainda tem uns ajustes a fazer',
		mine: false,
		time: '14:23',
	},
	{
		id: 6,
		text: 'Me avisa quando terminar que eu reviso',
		mine: true,
		time: '14:23',
	},
	{
		id: 7,
		text: 'Pode contar comigo!',
		mine: true,
		time: '14:23',
	},
]

export function Chat() {
	return (
		<section className="flex flex-col">
			<header className="border-foreground/20 border-b px-8 py-4">
				<div className="flex items-center gap-4">
					<Avatar className="size-12">
						<AvatarImage
							src="https://github.com/Bellorico323.png"
							alt="@Bellorico"
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>

					<div className="flex flex-col items-start justify-center">
						<h2>Murillo Orico</h2>
						<span className="text-muted-foreground text-sm leading-none">
							Online
						</span>
					</div>
				</div>
			</header>
			<ScrollArea className="flex-1 p-4">
				{MOCK_MESSAGES.map((msg) => (
					<div
						key={msg.id}
						className={cn('flex', msg.mine ? 'justify-end' : 'justify-start')}
					>
						<div
							className={cn(
								'mt-1 max-w-[70%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
								msg.mine
									? 'bg-primary text-primary-foreground rounded-br-sm'
									: 'bg-muted text-foreground rounded-bl-sm'
							)}
						>
							<p>{msg.text}</p>
							<span
								className={cn(
									'mt-1 block text-right text-xs',
									msg.mine
										? 'text-primary-foreground/70'
										: 'text-muted-foreground'
								)}
							>
								{msg.time}
							</span>
						</div>
					</div>
				))}
			</ScrollArea>
			<footer className="border-foreground/2- border-t px-8 py-4">
				<ChatInput onSend={(message) => console.log(message)} />
			</footer>
		</section>
	)
}
