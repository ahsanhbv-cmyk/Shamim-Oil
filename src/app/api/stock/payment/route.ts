import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { stockPaymentSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'
// POST add payment to stock entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = stockPaymentSchema.parse(body)

    // Verify stock entry exists
    const stockEntry = await prisma.stockEntry.findUnique({
      where: { id: validatedData.stockEntryId },
      include: { payments: true },
    })

    if (!stockEntry) {
      return NextResponse.json(
        { error: 'Stock entry not found' },
        { status: 404 }
      )
    }

    // Calculate current total paid
    const totalPaid = stockEntry.payments.reduce((sum, p) => sum + p.amountPaid, 0)
    const remainingDue = stockEntry.totalBill - totalPaid

    if (validatedData.amountPaid > remainingDue) {
      return NextResponse.json(
        { error: `Payment exceeds remaining due (${remainingDue})` },
        { status: 400 }
      )
    }

    const payment = await prisma.stockPayment.create({
      data: {
        stockEntryId: validatedData.stockEntryId,
        amountPaid: validatedData.amountPaid,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error adding payment:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to add payment' },
      { status: 500 }
    )
  }
}

