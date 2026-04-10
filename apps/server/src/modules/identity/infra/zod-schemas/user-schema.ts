import { z } from 'zod'

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	username: z.string(),
	email: z.email(),
	image: z.string().nullish(),
	emailVerified: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
})

export const authResponseSchema = z.object({
	token: z.string(),
	user: userSchema,
})
