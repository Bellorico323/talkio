import { Route, Routes } from 'react-router'
import { AuthLayout } from './pages/_layouts/auth'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { MainPage } from './pages/app/chats'
import { NotFound } from './pages/404'

export function Router() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>

      <Route path="/" element={<MainPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
