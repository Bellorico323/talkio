import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export function AuthLayout() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-message relative z-10">
      <Outlet />
    </div>
  )
}
