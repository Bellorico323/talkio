import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconInputControl, IconInputRoot } from '@/components/icon-input'
import { useState } from 'react'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

const signUpSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.regex(
			/^[a-zA-Z0-9_]+$/,
			'Username can only contain letters, numbers, and underscores',
		),
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignUpForm = z.infer<typeof signUpSchema>
type FormErrors = Partial<Record<keyof SignUpForm, string>>

const SignUpPage = () => {
	const navigate = useNavigate()
	const [form, setForm] = useState<SignUpForm>({
		name: '',
		username: '',
		email: '',
		password: '',
	})
	const [errors, setErrors] = useState<FormErrors>({})
	const [serverError, setServerError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	const handleChange =
		(field: keyof SignUpForm) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setForm((prev) => ({ ...prev, [field]: e.target.value }))
				if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
			}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setServerError(null)

		const result = signUpSchema.safeParse(form)
		if (!result.success) {
			const fieldErrors: FormErrors = {}
			for (const issue of result.error.issues) {
				const field = issue.path[0] as keyof SignUpForm
				if (!fieldErrors[field]) fieldErrors[field] = issue.message
			}
			setErrors(fieldErrors)
			return
		}

		setIsPending(true)
		const { error } = await authClient.signUp.email({
			name: form.name,
			email: form.email,
			password: form.password,
			username: form.username,
		} as Parameters<typeof authClient.signUp.email>[0])
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
				<h2 className="font-heading text-2xl font-bold">Create account</h2>
				<p className="text-muted-foreground text-sm">
					Join talkio and start connecting.
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-1.5">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						type="text"
						placeholder="Your display name"
						value={form.name}
						onChange={handleChange('name')}
						aria-invalid={!!errors.name}
					/>
					{errors.name && (
						<p className="text-destructive text-xs">{errors.name}</p>
					)}
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="username">Username</Label>
					<IconInputRoot aria-invalid={!!errors.username}>
						<span className="text-muted-foreground select-none text-sm">@</span>
						<IconInputControl
							id="username"
							type="text"
							placeholder="your_username"
							autoComplete="username"
							value={form.username}
							onChange={handleChange('username')}
						/>
					</IconInputRoot>
					{errors.username ? (
						<p className="text-destructive text-xs">{errors.username}</p>
					) : (
						<p className="text-muted-foreground text-xs">
							Must be unique. Used to identify you.
						</p>
					)}
				</div>

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
					{isPending ? 'Creating account…' : 'Create Account'}
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
}

export const Route = createFileRoute('/_auth/sign-up')({ component: SignUpPage })
