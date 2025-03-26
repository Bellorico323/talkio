import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { MessageCircleCodeIcon } from 'lucide-react'
import { Link } from 'react-router'

export function SignUp() {
  return (
    <Card className="px-2 py-8 w-[22rem] relative shadow-2xl">
      <div className="flex items-center justify-center border-b p-4">
        <MessageCircleCodeIcon />
        <h1 className="text-2xl">Talk.io</h1>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Sign up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label>Name</Label>
          <Input />
        </div>
        <div className="flex flex-col gap-3">
          <Label>E-mail</Label>
          <Input />
        </div>
        <Button className="w-full">Sign in</Button>

        <span>
          Already have an account?{' '}
          <Link to="/sign-in" className="underline">
            Sign-in
          </Link>
        </span>
      </CardContent>
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[200px] -z-10 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute -top-1/4 left-[-20%] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[200px] -z-10 transform -translate-x-1/2 -translate-y-1/2" />
    </Card>
  )
}
