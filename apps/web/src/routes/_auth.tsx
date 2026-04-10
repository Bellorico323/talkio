import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

const AuthLayout = () => (
	<div className="grid h-screen grid-cols-2">
		<div className="relative flex flex-col justify-between overflow-hidden bg-accent/50 p-10">
			<div className="flex items-center gap-2">
				<img src="/logo.svg" alt="" className="size-7 " />
				<span className="font-heading text-primary-foreground text-xl font-bold tracking-tight">
					talkio
				</span>
			</div>

			<div className="space-y-2">
				<p className="text-primary-foreground/60 text-sm font-medium uppercase tracking-widest">
					messaging platform
				</p>
				<h1 className="font-heading text-primary-foreground text-4xl font-bold leading-tight">
					Connect with
					<br />
					your people.
				</h1>
			</div>

			<div className="absolute right-8 top-1/4 flex flex-col gap-3 ">
				<div className="bg-primary-foreground/80 max-w-[180px] rounded-2xl rounded-tl-sm px-4 py-2.5 backdrop-blur-sm">
					<p className="text-primary text-sm">
						Hey! Are you free tonight? 👋
					</p>
				</div>
				<div className="bg-primary/80 ml-auto max-w-[160px] rounded-2xl rounded-tr-sm px-4 py-2.5 backdrop-blur-sm">
					<p className="text-primary-foreground text-sm">
						Yeah, what's up? 😄
					</p>
				</div>
				<div className="bg-primary-foreground/80 max-w-[200px] rounded-2xl rounded-tl-sm px-4 py-2.5 backdrop-blur-sm">
					<p className="text-primary text-sm">
						Let's grab dinner and catch up!
					</p>
				</div>
			</div>
		</div>

		<div className="bg-background flex items-center justify-center p-10">
			<Outlet />
		</div>
	</div>
)

export const Route = createFileRoute('/_auth')({
	component: AuthLayout, beforeLoad: ({ context }) => {
		console.log(context)

		if (!context.auth.isLoading && context.auth.user) {
			throw redirect({
				to: "/chats",
			})
		}
	}
})
