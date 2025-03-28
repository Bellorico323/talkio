import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface AddNewContactDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function AddNewContactDialog({
  open,
  setOpen,
}: AddNewContactDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
    resetOptions: {},
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
          <DialogDescription>Send invite to add a new friend</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 border-b pb-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="m-0 flex flex-col">
                    <FormLabel>Username</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input placeholder="example: talkio#1234" {...field} />
                      </FormControl>
                      <Button type="submit">Submit</Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div>
            <p className="text-md font-semibold mb-2">Recent</p>
            <div className="rounded bg-message">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  className="border-b border-accent py-1.5 flex gap-2.5 items-center last:border-none hover:bg-input/30 px-3"
                  key={idx}
                >
                  <Avatar className="size-8">
                    <AvatarImage src={'https://github.com/Bellorico323.png'} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <p>Murillo Orico</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
