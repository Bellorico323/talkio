import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

const signInSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

type SignInForm = z.infer<typeof signInSchema>
type FormErrors = Partial<Record<keyof SignInForm, string>>

const SignInPage = () => {
	const navigate = useNavigate()
	const [form, setForm] = useState<SignInForm>({ email: '', password: '' })
	const [errors, setErrors] = useState<FormErrors>({})
	const [serverError, setServerError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	const handleChange =
		(field: keyof SignInForm) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setForm((prev) => ({ ...prev, [field]: e.target.value }))
				if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
			}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setServerError(null)

		const result = signInSchema.safeParse(form)
		if (!result.success) {
			const fieldErrors: FormErrors = {}
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof SignInForm
				if (!fieldErrors[field]) fieldErrors[field] = issue.message
			}
			setErrors(fieldErrors)
			return
		}

		setIsPending(true)
		const { error } = await authClient.signIn.email({
			email: form.email,
			password: form.password,
		})
		setIsPending(false)

		if (error) {
			setServerError(error.message ?? 'Something went wrong. Please try again.')
			return
		}

		navigate({ to: '/chats' })
	}

	return (
		<div className="w-full max-w-sm space-y-8">
			<div className="space-y-1.5">
				<h2 className="font-heading text-2xl font-bold">Welcome back</h2>
				<p className="text-muted-foreground text-sm">
					Sign in to your account to continue.
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						value={form.email}
						onChange={handleChange('email')}
						aria-invalid={!!errors.email}
					/>
					{errors.email && (
						<p className="text-destructive text-xs">{errors.email}</p>
					)}
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						value={form.password}
						onChange={handleChange('password')}
						aria-invalid={!!errors.password}
					/>
					{errors.password && (
						<p className="text-destructive text-xs">{errors.password}</p>
					)}
				</div>

				{serverError && (
					<p className="text-destructive text-sm">{serverError}</p>
				)}

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending ? 'Signing in…' : 'Sign In'}
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
}

export const Route = createFileRoute('/_auth/sign-in')({ component: SignInPage })
