import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconInputControl, IconInputRoot } from '@/components/icon-input'

const SignUpPage = () => (
  <div className="w-full max-w-sm space-y-8">
    <div className="space-y-1.5">
      <h2 className="font-heading text-2xl font-bold">Create account</h2>
      <p className="text-muted-foreground text-sm">
        Join talkio and start connecting.
      </p>
    </div>

    <form className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" placeholder="Your display name" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <IconInputRoot>
          <span className="text-muted-foreground select-none text-sm">@</span>
          <IconInputControl
            id="username"
            type="text"
            placeholder="your_username"
            autoComplete="username"
          />
        </IconInputRoot>
        <p className="text-muted-foreground text-xs">
          Must be unique. Used to identify you.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>

    <p className="text-muted-foreground text-center text-sm">
      Already have an account?{' '}
      <Link
        to="/sign-in"
        className="text-foreground font-medium underline underline-offset-4"
      >
        Sign in
      </Link>
    </p>
  </div>
)

export const Route = createFileRoute('/_auth/sign-up')({ component: SignUpPage })
