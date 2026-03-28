import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'CUSTOMER') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-gold-50">
      <Sidebar role="CUSTOMER" />
      <main className="ml-72 p-8">
        {children}
      </main>
    </div>
  )
}

