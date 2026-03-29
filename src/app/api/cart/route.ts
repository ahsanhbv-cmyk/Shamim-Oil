import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Create cart if doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    return NextResponse.json({ ...cart, total })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, quantity } = body

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    // Check stock availability
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.cartonQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

// PUT update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { itemId, quantity } = body

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: itemId },
      })
      return NextResponse.json({ success: true })
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID required' },
        { status: 400 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}

