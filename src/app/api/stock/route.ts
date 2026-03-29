import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { stockEntrySchema, stockPaymentSchema } from '@/lib/validations'

// GET stock entries
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    const stockEntries = await prisma.stockEntry.findMany({
      where: productId ? { productId } : {},
      include: {
        product: {
          select: {
            name: true,
            company: true,
          },
        },
        payments: {
          orderBy: { datePaid: 'desc' },
        },
      },
      orderBy: { arrivalDate: 'desc' },
    })

    // Calculate remaining due for each entry
    const entriesWithDue = stockEntries.map((entry) => {
      const totalPaid = entry.payments.reduce((sum, p) => sum + p.amountPaid, 0)
      return {
        ...entry,
        totalPaid,
        remainingDue: entry.totalBill - totalPaid,
      }
    })

    return NextResponse.json(entriesWithDue)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock entries' },
      { status: 500 }
    )
  }
}

// POST new stock entry (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = stockEntrySchema.parse(body)

    const stockEntry = await prisma.stockEntry.create({
      data: {
        productId: validatedData.productId,
        quantityReceived: validatedData.quantityReceived,
        totalBill: validatedData.totalBill,
        supplierName: validatedData.supplierName,
        arrivalDate: validatedData.arrivalDate ? new Date(validatedData.arrivalDate) : new Date(),
      },
      include: {
        product: {
          select: {
            name: true,
            company: true,
          },
        },
      },
    })

    // Update product stock quantity
    await prisma.product.update({
      where: { id: validatedData.productId },
      data: {
        cartonQuantity: {
          increment: validatedData.quantityReceived,
        },
      },
    })

    return NextResponse.json(stockEntry, { status: 201 })
  } catch (error) {
    console.error('Error creating stock entry:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to create stock entry' },
      { status: 500 }
    )
  }
}

