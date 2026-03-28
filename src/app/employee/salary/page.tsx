'use client'

import { useEffect, useState } from 'react'
import { Wallet, TrendingUp, TrendingDown, Calculator } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import LoadingSpinner from '@/components/LoadingSpinner'

type UserData = {
  name: string
  employeeSalary: number | null
}

type AttendanceRecord = {
  status: 'PRESENT' | 'ABSENT'
}

export default function SalaryPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  useEffect(() => {
    fetchData()
  }, [selectedMonth])

  const fetchData = async () => {
    try {
      const [userRes, attRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/attendance?month=${selectedMonth}`),
      ])
      
      const userData = await userRes.json()
      const attData = await attRes.json()
      
      setUser(userData)
      setAttendance(attData)
    } catch (error) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  const baseSalary = user.employeeSalary || 0
  const workingDays = 26
  const perDaySalary = baseSalary / workingDays
  
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length
  const absentDays = attendance.filter(a => a.status === 'ABSENT').length
  
  const deduction = Math.round(absentDays * perDaySalary)
  const netSalary = baseSalary - deduction
  const attendanceRate = attendance.length > 0 
    ? Math.round((presentDays / attendance.length) * 100) 
    : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">Salary Details</h1>
          <p className="text-forest-500">View your salary breakdown</p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border-2 border-forest-200 rounded-xl focus:border-gold-500 outline-none"
        />
      </div>

      {/* Salary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Base Salary</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(baseSalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-600">Deductions</p>
                <p className="text-2xl font-bold text-red-700">-{formatCurrency(deduction)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Net Salary</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(netSalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gold-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gold-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gold-700">{attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-forest-50 rounded-xl">
              <span className="text-forest-600">Base Monthly Salary</span>
              <span className="font-semibold text-forest-700">{formatCurrency(baseSalary)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-forest-50 rounded-xl">
              <span className="text-forest-600">Per Day Salary</span>
              <span className="font-semibold text-forest-700">{formatCurrency(Math.round(perDaySalary))}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-forest-50 rounded-xl">
              <span className="text-forest-600">Working Days in Month</span>
              <span className="font-semibold text-forest-700">{workingDays}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <span className="text-green-600">Present Days</span>
              <span className="font-semibold text-green-700">{presentDays}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
              <span className="text-red-600">Absent Days</span>
              <span className="font-semibold text-red-700">{absentDays}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
              <span className="text-red-600">Deduction ({absentDays} × {formatCurrency(Math.round(perDaySalary))})</span>
              <span className="font-semibold text-red-700">-{formatCurrency(deduction)}</span>
            </div>
            <div className="border-t-2 border-forest-200 pt-4">
              <div className="flex justify-between items-center p-4 bg-gold-100 rounded-xl">
                <span className="text-lg font-semibold text-forest-700">Net Payable Salary</span>
                <span className="text-2xl font-bold text-gold-600">{formatCurrency(netSalary)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

