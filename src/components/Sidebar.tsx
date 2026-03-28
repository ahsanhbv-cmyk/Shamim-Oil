'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Calendar,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Boxes,
  Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from './Logo'

type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Products', href: '/admin/products', icon: Package },
  { title: 'Stock', href: '/admin/stock', icon: Boxes },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { title: 'Employees', href: '/admin/employees', icon: Users },
  { title: 'Attendance', href: '/admin/attendance', icon: Calendar },
  { title: 'Messages', href: '/admin/messages', icon: MessageSquare },
]

const employeeNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/employee', icon: LayoutDashboard },
  { title: 'Profile', href: '/employee/profile', icon: User },
  { title: 'Attendance', href: '/employee/attendance', icon: Calendar },
  { title: 'Salary', href: '/employee/salary', icon: Wallet },
]

const customerNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/customer', icon: LayoutDashboard },
  { title: 'Shop', href: '/customer/shop', icon: Package },
  { title: 'Cart', href: '/customer/cart', icon: ShoppingCart },
  { title: 'My Orders', href: '/customer/orders', icon: Boxes },
  { title: 'Messages', href: '/customer/messages', icon: MessageSquare },
]

export default function Sidebar({ role }: { role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER' }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = role === 'ADMIN' 
    ? adminNavItems 
    : role === 'EMPLOYEE' 
    ? employeeNavItems 
    : customerNavItems

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-forest-700 via-forest-800 to-forest-900 shadow-2xl z-50">
      {/* Logo */}
      <div className="p-6 border-b border-forest-600/50">
        <Link href="/">
          <Logo size="md" showText={true} />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-forest-600/30 border border-forest-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
            <User className="h-5 w-5 text-forest-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-gold-400 capitalize">
              {role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive
                  ? "bg-gold-500 text-forest-900 shadow-lg shadow-gold-500/30"
                  : "text-forest-100 hover:bg-forest-600/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive ? "text-forest-900" : "text-gold-400"
              )} />
              <span className="font-medium">{item.title}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-forest-600/50">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-forest-200 hover:bg-red-500/20 hover:text-red-400 transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:text-red-400" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
