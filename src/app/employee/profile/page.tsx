import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { User, Mail, Phone, Calendar, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getEmployeeProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      employeeSalary: true,
      createdAt: true,
    },
  })
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const profile = await getEmployeeProfile(session.user.id)
  if (!profile) return null

  const infoItems = [
    { icon: User, label: 'Full Name', value: profile.name },
    { icon: Mail, label: 'Email Address', value: profile.email },
    { icon: Phone, label: 'Phone Number', value: profile.phone || 'Not provided' },
    { icon: Wallet, label: 'Monthly Salary', value: formatCurrency(profile.employeeSalary || 0) },
    { icon: Calendar, label: 'Joined', value: formatDate(profile.createdAt) },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest-700">My Profile</h1>
        <p className="text-forest-500">Your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-forest-900" />
            </div>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-forest-500">Employee</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {infoItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-forest-50 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow">
                  <item.icon className="h-6 w-6 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm text-forest-500">{item.label}</p>
                  <p className="font-semibold text-forest-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

