import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    let where: any = {}

    // Customers can only see their own orders
    if (session.user.role === 'CUSTOMER') {
      where.customerId = session.user.id
    }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                company: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: parseInt(limit) }),
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST create order (Customer only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { items, paymentMethod, shippingAddress } = body

    // Calculate total and validate stock
    let totalAmount = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        )
      }

      if (product.cartonQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      totalAmount += product.price * item.quantity
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: session.user.id,
        totalAmount,
        paymentMethod,
        shippingAddress,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          cartonQuantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    // Clear customer's cart
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT update order status (Admin) or approve (Customer)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { orderId, status, action } = body

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Customer approval action
    if (action === 'approve' && session.user.role === 'CUSTOMER') {
      if (order.customerId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          customerApproved: true,
          status: 'CONFIRMED',
        },
      })

      return NextResponse.json(updatedOrder)
    }

    // Admin status update
    if (session.user.role === 'ADMIN') {
      const updateData: any = {}

      if (status) {
        updateData.status = status
      }

      if (body.confirmationSent !== undefined) {
        updateData.confirmationSent = body.confirmationSent
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json(updatedOrder)
    }

    return NextResponse.json({ error: 'Unauthorized action' }, { status: 401 })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE order (Customer - before dispatch only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check authorization
    if (session.user.role === 'CUSTOMER' && order.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Can only delete if not yet dispatched
    if (['DISPATCHED', 'DELIVERED'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Cannot delete dispatched or delivered orders' },
        { status: 400 }
      )
    }

    // Restore stock
    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          cartonQuantity: {
            increment: item.quantity,
          },
        },
      })
    }

    // Delete order
    await prisma.order.delete({
      where: { id: orderId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

