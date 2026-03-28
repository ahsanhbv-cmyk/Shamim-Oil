import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'EMPLOYEE') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-gold-50">
      <Sidebar role="EMPLOYEE" />
      <main className="ml-72 p-8">
        {children}
      </main>
    </div>
  )
}

