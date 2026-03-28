import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { User, Calendar, Wallet, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

async function getEmployeeData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      attendance: {
        orderBy: { date: 'desc' },
        take: 30,
      },
    },
  })

  if (!user) return null

  const presentDays = user.attendance.filter(a => a.status === 'PRESENT').length
  const absentDays = user.attendance.filter(a => a.status === 'ABSENT').length
  const totalDays = user.attendance.length

  // Calculate salary (assuming 26 working days per month)
  const workingDays = 26
  const baseSalary = user.employeeSalary || 0
  const perDaySalary = baseSalary / workingDays
  const deduction = absentDays * perDaySalary
  const netSalary = baseSalary - deduction

  return {
    ...user,
    presentDays,
    absentDays,
    totalDays,
    baseSalary,
    deduction,
    netSalary,
  }
}

export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const employee = await getEmployeeData(session.user.id)
  if (!employee) return null

  const stats = [
    {
      title: 'Present Days',
      value: employee.presentDays,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Absent Days',
      value: employee.absentDays,
      icon: Calendar,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Base Salary',
      value: formatCurrency(employee.baseSalary),
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Net Salary',
      value: formatCurrency(employee.netSalary),
      icon: TrendingUp,
      color: 'from-gold-500 to-gold-600',
      bgColor: 'bg-gold-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-lg">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">
            Welcome, {employee.name}!
          </h1>
          <p className="text-forest-500">{employee.email}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className={stat.bgColor}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-forest-500 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-forest-700">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {employee.attendance.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-forest-50 rounded-xl"
              >
                <p className="font-medium text-forest-700">
                  {new Date(record.date).toLocaleDateString('en-PK', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  record.status === 'PRESENT'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
            {employee.attendance.length === 0 && (
              <p className="text-center py-8 text-forest-500">
                No attendance records yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

