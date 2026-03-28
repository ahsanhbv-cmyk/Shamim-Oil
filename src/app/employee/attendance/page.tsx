'use client'

import { useEffect, useState } from 'react'
import { Calendar, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoadingSpinner from '@/components/LoadingSpinner'

type AttendanceRecord = {
  id: string
  date: string
  status: 'PRESENT' | 'ABSENT'
}

export default function EmployeeAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth])

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/attendance?month=${selectedMonth}`)
      const data = await res.json()
      setAttendance(data)
    } catch (error) {
      console.error('Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }

  const presentDays = attendance.filter(a => a.status === 'PRESENT').length
  const absentDays = attendance.filter(a => a.status === 'ABSENT').length

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">My Attendance</h1>
          <p className="text-forest-500">View your attendance history</p>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border-2 border-forest-200 rounded-xl focus:border-gold-500 outline-none"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Present Days</p>
                <p className="text-3xl font-bold text-green-700">{presentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                <X className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-600">Absent Days</p>
                <p className="text-3xl font-bold text-red-700">{absentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Recorded</p>
                <p className="text-3xl font-bold text-blue-700">{presentDays + absentDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gold-500" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-forest-50 rounded-xl"
              >
                <p className="font-medium text-forest-700">
                  {new Date(record.date).toLocaleDateString('en-PK', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <Badge
                  variant={record.status === 'PRESENT' ? 'success' : 'destructive'}
                  className="text-sm"
                >
                  {record.status}
                </Badge>
              </div>
            ))}
            {attendance.length === 0 && (
              <p className="text-center py-8 text-forest-500">
                No attendance records for this month
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

