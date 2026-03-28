import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [products, orders, employees, revenue, pendingOrders, stockEntries] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'EMPLOYEE' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'DELIVERED' }
      }),
      prisma.order.count({ where: { status: { in: ['NEW', 'PENDING'] } } }),
      prisma.stockEntry.count(),
    ])

    return NextResponse.json({
      totalProducts: products,
      totalOrders: orders,
      totalEmployees: employees,
      totalRevenue: revenue._sum.totalAmount || 0,
      pendingOrders,
      stockEntries,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
