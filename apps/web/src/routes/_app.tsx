import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { MessageCircle, Users2Icon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ModeToggle } from '@/components/mode-toggle'

const AppLayout = () => (
	<div className="bg-background flex h-screen w-full">
		<aside className="border-foreground/20 flex flex-col items-center justify-between border-r p-4">
			<img src="/logo.svg" alt="" className="size-8" />

			<nav className="flex flex-col items-center gap-3">
				<Link
					to="/chats"
					className="[&.active]:text-foreground text-muted-foreground"
				>
					<MessageCircle className="size-5" />
				</Link>
				<Link
					to="/friends"
					className="[&.active]:text-foreground text-muted-foreground"
				>
					<Users2Icon className="size-5" />
				</Link>
			</nav>

			<div className="flex flex-col items-center gap-3">
				<ModeToggle />
				<Avatar>
					<AvatarImage
						src="https://github.com/shadcn.png"
						alt="@shadcn"
						className="grayscale"
					/>
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</div>
		</aside>
		<div className="h-full w-full">
			<Outlet />
		</div>
	</div>
)

export const Route = createFileRoute('/_app')({
	component: AppLayout,
	beforeLoad({ context, location }) {
		if (context.auth.isLoading) return

		if (!context.auth.user) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: location.href }
			})
		}
	},
})
