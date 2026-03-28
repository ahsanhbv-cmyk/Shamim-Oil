import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ShoppingCart, Package, Boxes, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

async function getCustomerStats(userId: string) {
  const [orders, totalSpent, cartItems] = await Promise.all([
    prisma.order.count({ where: { customerId: userId } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { customerId: userId, status: 'DELIVERED' },
    }),
    prisma.cartItem.count({
      where: { cart: { userId } },
    }),
  ])

  const recentOrders = await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return {
    totalOrders: orders,
    totalSpent: totalSpent._sum.totalAmount || 0,
    cartItems,
    recentOrders,
  }
}

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const stats = await getCustomerStats(session.user.id)

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Cart Items',
      value: stats.cartItems,
      icon: ShoppingCart,
      color: 'from-gold-500 to-gold-600',
      bgColor: 'bg-gold-50',
    },
    {
      title: 'Products Available',
      value: '8+',
      icon: Boxes,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-forest-500">
            Start shopping for premium quality oils
          </p>
        </div>
        <Link href="/customer/shop">
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" /> Shop Now
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className={stat.bgColor}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-forest-500 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-forest-700">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-forest-700">Recent Orders</h2>
            <Link href="/customer/orders" className="text-gold-600 hover:text-gold-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-forest-50 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-forest-700">
                    {order.orderItems.length} items • {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-sm text-forest-500">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'DISPATCHED' ? 'bg-purple-100 text-purple-700' :
                  order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-forest-500 mb-4">No orders yet</p>
                <Link href="/customer/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

