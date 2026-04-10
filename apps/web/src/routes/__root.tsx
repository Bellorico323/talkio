import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export interface RouterContext {
	queryClient: QueryClient,
	auth: {
		user: { id: string; name: string; email: string } | null
		isLoading: boolean
	}
}

export const Route = createRootRouteWithContext<RouterContext>()({ component: () => <Outlet /> })
