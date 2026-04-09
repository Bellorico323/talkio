import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SignInPage = () => (
  <div className="w-full max-w-sm space-y-8">
    <div className="space-y-1.5">
      <h2 className="font-heading text-2xl font-bold">Welcome back</h2>
      <p className="text-muted-foreground text-sm">
        Sign in to your account to continue.
      </p>
    </div>

    <form className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>

    <p className="text-muted-foreground text-center text-sm">
      Don&apos;t have an account?{' '}
      <Link
        to="/sign-up"
        className="text-foreground font-medium underline underline-offset-4"
      >
        Sign up
      </Link>
    </p>
  </div>
)

export const Route = createFileRoute('/_auth/sign-in')({ component: SignInPage })
