import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, MessageCircleCodeIcon } from 'lucide-react'
import { Link } from 'react-router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/http/sign-in'

const signInSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid e-mail.' }),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  })

  const { mutateAsync: signInMutation, data } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      return await signIn({ email })
    },
  })

  async function handleSubmitEmail({ email }: SignInSchema) {
    await signInMutation({ email })

    if (data && data.message) {
      setError('email', { message: data.message, type: 'custom' })
      return
    }
    reset()
  }

  return (
    <Card className="px-2 py-8 w-[22rem] relative shadow-2xl">
      <div className="flex gap-2 items-center justify-center border-b p-4">
        <MessageCircleCodeIcon />
        <h1 className="text-2xl">Talk.io</h1>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
        <CardDescription>
          We will send you an e-mail for authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(handleSubmitEmail)}>
          <div className="flex flex-col gap-3">
            <Label>E-mail</Label>
            <Input {...register('email')} autoComplete="off" />
            {errors.email?.message && (
              <p className="text-rose-400 text-sm">{errors.email.message}</p>
            )}
          </div>
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign in'}
          </Button>

          <span>
            Doesn&apos;t have an account yet?{' '}
            <Link to="/sign-up" className="underline">
              Register
            </Link>
          </span>
        </form>
      </CardContent>
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[200px] -z-10 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute -top-1/4 left-[-20%] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[200px] -z-10 transform -translate-x-1/2 -translate-y-1/2" />
    </Card>
  )
}
