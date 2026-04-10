import { useEffect } from "react"
import { authClient } from "../lib/auth-client"
import { useAuthStore } from "../stores/auth.store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = authClient.useSession()
	const { setUser, setLoading } = useAuthStore()

	useEffect(() => {
		setLoading(isPending)

		if (!isPending) {
			setUser(session?.user ?? null)
		}
	}, [session, isPending])


	return <>{children}</>
}
