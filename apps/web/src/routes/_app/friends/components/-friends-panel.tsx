import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { MessageSquare, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Friend {
	id: string
	name: string
	avatarFallback: string
}

interface FriendsPanelProps {
	friends: Friend[]
}

export function FriendsPanel({ friends }: FriendsPanelProps) {
	return (
		<div className="flex h-full flex-col gap-6 p-6">
			<div className="flex flex-col gap-2">
				<h2 className="font-heading text-lg font-semibold">Add Friend</h2>
				<div className="flex gap-2">
					<IconInputRoot>
						<UserPlus className="text-muted-foreground size-4 shrink-0" />
						<IconInputControl placeholder="Search by username..." />
					</IconInputRoot>
					<Button className="shrink-0">Send Request</Button>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<h2 className="font-heading text-lg font-semibold">
					Sugested Friends ({friends.length})
				</h2>

				{friends.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						You have no friends yet. Add someone above!
					</p>
				) : (
					<div className="grid grid-cols-2 gap-3">
						{friends.map((friend) => (
							<Card
								key={friend.id}
							>
								<CardContent>
									<div className='flex items-center justify-center flex-col gap-5'>
										<div className='flex flex-col gap-2.5 items-center'>
											<Avatar size="lg" className="size-14">
												<AvatarFallback>{friend.avatarFallback}</AvatarFallback>
											</Avatar>
											<span className="text-foreground text-sm font-medium leading-none">
												{friend.name}
											</span>
										</div>
										<Button variant="outline" size="sm" className="w-full gap-1.5">
											<MessageSquare className="size-3.5" />
											Message
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
