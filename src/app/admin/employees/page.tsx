'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import LoadingSpinner from '@/components/LoadingSpinner'

type Employee = {
  id: string
  name: string
  email: string
  phone: string | null
  employeeSalary: number | null
  createdAt: string
  presentDays: number
  absentDays: number
  totalDays: number
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salary: 0,
    password: '',
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees')
      const data = await res.json()
      setEmployees(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch employees', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create employee')
      }

      toast({ title: 'Success', description: 'Employee created successfully' })
      setIsDialogOpen(false)
      setFormData({ name: '', email: '', phone: '', salary: 0, password: '' })
      fetchEmployees()
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to create employee', 
        variant: 'destructive' 
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return
    
    try {
      const res = await fetch(`/api/employees?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      toast({ title: 'Success', description: 'Employee deleted successfully' })
      fetchEmployees()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete employee', variant: 'destructive' })
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">Employees</h1>
          <p className="text-forest-500">Manage your team members</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Employee name"
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="employee@example.com"
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  required
                />
              </div>
              <div>
                <Label>Monthly Salary (PKR)</Label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  min={0}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Employee
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-forest-600" />
                      </div>
                      <span className="font-medium text-forest-700">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{employee.email}</p>
                    <p className="text-xs text-forest-500">{employee.phone}</p>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(employee.employeeSalary || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {employee.presentDays}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {employee.absentDays}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(employee.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {employees.length === 0 && (
            <div className="text-center py-12 text-forest-500">
              No employees found. Add your first employee!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

