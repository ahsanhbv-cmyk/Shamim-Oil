import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { attendanceSchema } from '@/lib/validations'

// GET attendance records
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const month = searchParams.get('month') // Format: YYYY-MM

    let where: any = {}

    // Employees can only see their own attendance
    if (session.user.role === 'EMPLOYEE') {
      where.employeeId = session.user.id
    } else if (employeeId) {
      where.employeeId = employeeId
    }

    if (month) {
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0)
      where.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    const attendance = await prisma.employeeAttendance.findMany({
      where,
      include: {
        employee: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

// POST mark attendance (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = attendanceSchema.parse(body)

    const attendanceDate = new Date(validatedData.date)
    attendanceDate.setHours(0, 0, 0, 0)

    // Upsert attendance (update if exists, create if not)
    const attendance = await prisma.employeeAttendance.upsert({
      where: {
        employeeId_date: {
          employeeId: validatedData.employeeId,
          date: attendanceDate,
        },
      },
      update: {
        status: validatedData.status,
      },
      create: {
        employeeId: validatedData.employeeId,
        date: attendanceDate,
        status: validatedData.status,
      },
      include: {
        employee: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error marking attendance:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    )
  }
}

