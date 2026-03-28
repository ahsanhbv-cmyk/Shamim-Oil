'use client'

import { useEffect, useState } from 'react'
import { Calendar, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import LoadingSpinner from '@/components/LoadingSpinner'

type Employee = {
  id: string
  name: string
  email: string
}

type AttendanceRecord = {
  id: string
  employeeId: string
  date: string
  status: 'PRESENT' | 'ABSENT'
  employee: {
    name: string
  }
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    try {
      const [empRes, attRes] = await Promise.all([
        fetch('/api/employees'),
        fetch(`/api/attendance?month=${selectedDate.slice(0, 7)}`),
      ])
      
      const empData = await empRes.json()
      const attData = await attRes.json()
      
      setEmployees(empData)
      setAttendance(attData)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (employeeId: string, status: 'PRESENT' | 'ABSENT') => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
          status,
        }),
      })

      if (!res.ok) throw new Error('Failed to mark attendance')

      toast({ 
        title: 'Success', 
        description: `Marked as ${status.toLowerCase()}` 
      })
      fetchData()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to mark attendance', variant: 'destructive' })
    }
  }

  const getAttendanceForEmployee = (employeeId: string, date: string) => {
    return attendance.find(
      (a) => a.employeeId === employeeId && a.date.split('T')[0] === date
    )
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">Attendance</h1>
          <p className="text-forest-500">Track employee attendance</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 border-forest-200 rounded-xl focus:border-gold-500 outline-none"
          />
        </div>
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gold-500" />
            Attendance for {new Date(selectedDate).toLocaleDateString('en-PK', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.map((employee) => {
              const record = getAttendanceForEmployee(employee.id, selectedDate)
              return (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-forest-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-forest-700">{employee.name}</p>
                    <p className="text-sm text-forest-500">{employee.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {record ? (
                      <span className={`px-4 py-2 rounded-lg font-semibold ${
                        record.status === 'PRESENT' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 gap-1"
                          onClick={() => markAttendance(employee.id, 'PRESENT')}
                        >
                          <Check className="h-4 w-4" /> Present
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => markAttendance(employee.id, 'ABSENT')}
                        >
                          <X className="h-4 w-4" /> Absent
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
            {employees.length === 0 && (
              <div className="text-center py-8 text-forest-500">
                No employees found. Add employees first.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {employees.map((employee) => {
              const employeeAttendance = attendance.filter(
                (a) => a.employeeId === employee.id
              )
              const presentDays = employeeAttendance.filter(
                (a) => a.status === 'PRESENT'
              ).length
              const absentDays = employeeAttendance.filter(
                (a) => a.status === 'ABSENT'
              ).length

              return (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 border border-forest-100 rounded-xl"
                >
                  <p className="font-semibold text-forest-700">{employee.name}</p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                      <p className="text-xs text-forest-500">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{absentDays}</p>
                      <p className="text-xs text-forest-500">Absent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-forest-600">{presentDays + absentDays}</p>
                      <p className="text-xs text-forest-500">Total</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

