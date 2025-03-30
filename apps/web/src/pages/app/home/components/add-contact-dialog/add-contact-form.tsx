import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { sendFriendshipInvite } from '@/http/send-friendship-invite'
import { queryClient } from '@/lib/query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  usernameWithCode: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

type AddNewContactFormSchema = z.infer<typeof formSchema>

export function AddContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameWithCode: '',
    },
    resetOptions: {},
  })

  const { mutateAsync: sendFriendInvite, data } = useMutation({
    mutationFn: async ({ usernameWithCode }: AddNewContactFormSchema) => {
      const response = await sendFriendshipInvite({ usernameWithCode })

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
    },
  })

  async function onSubmit(values: AddNewContactFormSchema) {
    await sendFriendInvite(values)

    if (data) {
      form.setError('usernameWithCode', {
        type: 'custom',
        message: data.message || 'Error',
      })
      return
    }

    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 border-b pb-4"
      >
        <FormField
          control={form.control}
          name="usernameWithCode"
          render={({ field }) => (
            <FormItem className="m-0 flex flex-col">
              <FormLabel>Username</FormLabel>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Input
                    placeholder="talkio#1234"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <Button type="submit">Send</Button>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
