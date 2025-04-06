import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RecentChats } from './recent-chats'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounce } from '@/hooks/use-debounce'
import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useEffect } from 'react'
import { fetchFriends } from '@/http/fetch-friends'
import { useGroupedFriends } from '@/hooks/use-grouped-friends'
import { useNavigate } from 'react-router'

interface NewChatDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const searchFormSchema = z.object({
  search: z.string().min(1, { message: 'Minimun of 1 character' }),
})

type SearchFormSchema = z.infer<typeof searchFormSchema>

export function NewChatDialog({ open, setOpen }: NewChatDialogProps) {
  const navigate = useNavigate()

  const form = useForm<SearchFormSchema>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: '',
    },
  })

  const { watch, reset } = form

  const searchQuery = watch('search')
  const debouncedSearch = useDebounce(searchQuery)

  const { data } = useQuery({
    queryKey: ['friends', debouncedSearch],
    queryFn: async () => {
      return await fetchFriends({ friendName: debouncedSearch })
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const groupedFriends = useGroupedFriends(data?.friends || [])

  useEffect(() => {
    return () => reset()
  }, [open, reset])

  function selectFriend(params: { chatId: string | null; friendId: string }) {
    navigate(`/${params.chatId ?? 'new-chat'}/${params.friendId}`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>Create new chat</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Search"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {searchQuery ? null : (
            <div className="flex flex-col gap-2.5">
              <p>Recent chats</p>
              <RecentChats />
            </div>
          )}

          {data?.friends && data?.friends.length > 0 ? (
            <ScrollArea className="h-[14rem]">
              {data?.friends &&
                Object.keys(groupedFriends)
                  .sort()
                  .map((letter) => (
                    <div
                      className="flex flex-col gap-2.5 pr-3 mb-3"
                      key={letter}
                    >
                      <p>{letter}</p>

                      <div className="flex flex-col  bg-message rounded">
                        {groupedFriends[letter] &&
                          groupedFriends[letter].map((item) => (
                            <div
                              className="border-b border-accent py-1.5 flex gap-2.5 items-center last:border-none hover:bg-input/30 px-3 hover:cursor-pointer"
                              key={item.friendId}
                              onClick={() =>
                                selectFriend({
                                  chatId: item.chatId,
                                  friendId: item.friendId,
                                })
                              }
                            >
                              <Avatar className="size-8">
                                <AvatarImage src={item.avatarUrl} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>

                              <p>{item.friendName}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-lg font-medium">No results</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
