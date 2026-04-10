import { StrictMode } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./lib/query-client";
import { RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth.store";

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: {
			user: null,
			isLoading: true,
		},
	},
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
})

export function App() {
	const { user, isLoading } = useAuthStore()

	if (isLoading) return

	return (
		<StrictMode>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} context={{ auth: { user, isLoading } }} />
				</QueryClientProvider>
			</ThemeProvider>
		</StrictMode>
	)
}
