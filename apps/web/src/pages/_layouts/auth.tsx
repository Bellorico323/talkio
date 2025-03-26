import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-message relative z-10">
      <Outlet />
    </div>
  )
}
