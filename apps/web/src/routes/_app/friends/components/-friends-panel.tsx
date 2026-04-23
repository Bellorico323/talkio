import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { searchUsersByUsername } from '@/http/search-users-by-username'
import { useQuery } from '@tanstack/react-query'
import { Check, Clock, Loader2, UserPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FriendRequest {
	id: string
	name: string
	avatarFallback: string
	direction: 'received' | 'sent'
	sentAt?: Date
}

interface FriendsPanelProps {
	requests: FriendRequest[]
}

function getAvatarFallback(name: string): string {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

function formatPendingTime(sentAt: Date): string {
	const diffMs = Date.now() - sentAt.getTime()
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
	if (diffDays === 0) return 'today'
	if (diffDays === 1) return '1 day ago'
	return `${diffDays} days ago`
}

export function FriendsPanel({ requests }: FriendsPanelProps) {
	const [username, setUsername] = useState('')
	const [debouncedUsername, setDebouncedUsername] = useState('')
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const received = requests.filter((r) => r.direction === 'received')
	const sent = requests.filter((r) => r.direction === 'sent')

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedUsername(username), 300)
		return () => clearTimeout(timer)
	}, [username])

	const { data, isFetching } = useQuery({
		queryKey: ['users', 'search', debouncedUsername],
		queryFn: async () => {
			const { data, error } = await searchUsersByUsername({ username: debouncedUsername })
			if (error || !data) throw error
			return data
		},
		enabled: debouncedUsername.trim().length > 0,
		placeholderData: (prev) => prev,
	})

	const users = data?.users ?? []

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setUsername(e.target.value)
		setIsPopoverOpen(e.target.value.trim().length > 0)
	}

	function handleSelectUser(selectedUsername: string) {
		setUsername(selectedUsername)
		setIsPopoverOpen(false)
	}

	return (
		<div className="flex h-full flex-col gap-6 p-6">
			<div className="flex flex-col gap-2">
				<h2 className="font-heading text-lg font-semibold">Add Friend</h2>
				<Popover open={isPopoverOpen}>
					<div className="flex gap-2">
						<PopoverAnchor asChild>
							<div className="min-w-0 flex-1">
								<IconInputRoot>
									<UserPlus className="text-muted-foreground size-4 shrink-0" />
									<IconInputControl
										placeholder="Search by username..."
										value={username}
										onChange={handleInputChange}
										onBlur={() => setIsPopoverOpen(false)}
									/>
								</IconInputRoot>
							</div>
						</PopoverAnchor>
						<Button className="shrink-0">Send Request</Button>
					</div>
					<PopoverContent
						align="start"
						sideOffset={6}
						className="w-[var(--radix-popover-trigger-width)] gap-1 p-2"
						onOpenAutoFocus={(e) => e.preventDefault()}
					>
						{isFetching ? (
							<div className="text-muted-foreground flex items-center justify-center gap-2 py-3 text-sm">
								<Loader2 className="size-4 animate-spin" />
								Searching...
							</div>
						) : users.length === 0 ? (
							<p className="text-muted-foreground py-3 text-center text-sm">
								No users found.
							</p>
						) : (
							users.map((user) => (
								<button
									key={user.username}
									className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors"
									onClick={() => handleSelectUser(user.username)}
								>
									<Avatar className="size-8 shrink-0">
										<AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
									</Avatar>
									<div className="flex min-w-0 flex-col">
										<span className="text-sm font-medium leading-none">{user.name}</span>
										<span className="text-muted-foreground text-xs">@{user.username}</span>
									</div>
								</button>
							))
						)}
					</PopoverContent>
				</Popover>
			</div>

			<section className="flex flex-col gap-3">
				<h2 className="font-heading text-lg font-semibold">
					Received ({received.length})
				</h2>

				{received.length === 0 ? (
					<p className="text-muted-foreground text-sm">No pending incoming requests.</p>
				) : (
					<div className="flex flex-col gap-2">
						{received.map((req) => (
							<div
								key={req.id}
								className="border-foreground/10 flex items-center gap-3 rounded-2xl border p-3"
							>
								<Avatar className="size-10">
									<AvatarFallback>{req.avatarFallback}</AvatarFallback>
								</Avatar>
								<span className="text-foreground flex-1 text-base leading-none">
									{req.name}
								</span>
								<div className="flex gap-2">
									<Button size="sm" className="gap-1">
										<Check className="size-3.5" />
										Accept
									</Button>
									<Button variant="destructive" size="sm" className="gap-1">
										<X className="size-3.5" />
										Reject
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-heading text-lg font-semibold">
					Sent ({sent.length})
				</h2>

				{sent.length === 0 ? (
					<p className="text-muted-foreground text-sm">No outgoing pending requests.</p>
				) : (
					<div className="flex flex-col gap-2">
						{sent.map((req) => (
							<div
								key={req.id}
								className="border-foreground/10 flex items-center gap-3 rounded-2xl border p-3"
							>
								<Avatar className="size-10">
									<AvatarFallback>{req.avatarFallback}</AvatarFallback>
								</Avatar>
								<span className="text-foreground flex-1 text-base leading-none">
									{req.name}
								</span>
								<div className="flex items-center gap-2">
									{req.sentAt && (
										<span className="text-muted-foreground flex items-center gap-1 text-xs">
											<Clock className="size-3.5" />
											{formatPendingTime(req.sentAt)}
										</span>
									)}
									<Button variant="ghost" size="sm" className="gap-1">
										<X className="size-3.5" />
										Cancel
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	)
}
