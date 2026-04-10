import { create } from "zustand"

type User = {
	id: string
	name: string
	email: string
}

type AuthState = {
	user: User | null
	isLoading: boolean
	setUser: (user: User | null) => void
	setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLoading: true,
	setUser: (user) => set({ user }),
	setLoading: (isLoading) => set({ isLoading }),
}))
