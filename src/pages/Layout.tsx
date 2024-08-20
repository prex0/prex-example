import { Outlet } from 'react-router-dom'
import RegisterWallet from '../components/RegisterWallet'

export function Layout() {
  return (
    <RegisterWallet>
      <Outlet />
    </RegisterWallet>
  )
}
