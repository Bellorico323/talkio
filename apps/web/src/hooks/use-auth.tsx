import { api } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

interface User {
  user: {
    id: string
    name: string
    email: string
    phone: string
    avatarUrl: string
    createdAt: string
    updatedAt: string
  }
}

export function useAuth() {
  const { data, isLoading, isError } = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const response = await api.get<User>('me')
        const user = await response.json()
        return user
      } catch {
        return null
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  return { user: data?.user, isLoading, isError }
}
