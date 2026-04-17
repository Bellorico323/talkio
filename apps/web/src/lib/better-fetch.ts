import { createFetch } from "@better-fetch/fetch"

export const $fetch = createFetch({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
	retry: {
		type: "linear",
		attempts: 3,
		delay: 1000,
	},
})
