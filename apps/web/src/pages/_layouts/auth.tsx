import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-150 from-neutral-800 to-neutral-950">
      <Outlet />
    </div>
  )
}
