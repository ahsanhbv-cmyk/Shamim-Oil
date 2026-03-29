import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { messageSchema, replySchema } from '@/lib/validations'

// GET messages
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let where: any = {}

    // Customers can only see their own messages
    if (session.user.role === 'CUSTOMER') {
      where.customerId = session.user.id
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        admin: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST send message (Customer) or reply (Admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Customer sending new message
    if (session.user.role === 'CUSTOMER') {
      const validatedData = messageSchema.parse(body)

      const message = await prisma.message.create({
        data: {
          customerId: session.user.id,
          message: validatedData.message,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json(message, { status: 201 })
    }

    // Admin replying to message
    if (session.user.role === 'ADMIN') {
      const validatedData = replySchema.parse(body)

      const message = await prisma.message.update({
        where: { id: validatedData.messageId },
        data: {
          reply: validatedData.reply,
          adminId: session.user.id,
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          admin: {
            select: {
              name: true,
            },
          },
        },
      })

      return NextResponse.json(message)
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  } catch (error) {
    console.error('Error with message:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

