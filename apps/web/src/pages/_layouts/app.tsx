import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export function AppLayout() {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) navigate('/sign-in', { replace: true })
  }, [user, navigate, isLoading])

  if (isLoading) return null

  return (
    <>
      <Outlet />
    </>
  )
}
