import { $fetch } from "@/lib/better-fetch";
import z from "zod";

interface SearchUsersByUsernameRequest {
	username?: string
}

const searchUsersByUsernameResponseSchema = z.object({
	users: z.array(z.object({
		name: z.string(),
		username: z.string(),
		email: z.string(),
		image: z.string().optional().nullish(),
	})),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
})

export async function searchUsersByUsername(params: SearchUsersByUsernameRequest) {
	return $fetch("/users", {
		query: {
			username: params.username,
		},
		output: searchUsersByUsernameResponseSchema,
	})
}
