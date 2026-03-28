'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'

type Order = {
  id: string
  customer: { name: string }
  totalAmount: number
  status: string
  createdAt: string
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders?limit=5')
        const data = await res.json()
        setOrders(data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-forest-50 rounded-xl animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-forest-200 rounded"></div>
              <div className="h-3 w-24 bg-forest-100 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-forest-200 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-forest-500">
        No orders yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-forest-50 to-gold-50 rounded-xl hover:shadow-md transition-shadow"
        >
          <div>
            <p className="font-semibold text-forest-700">{order.customer.name}</p>
            <p className="text-sm text-forest-500">
              {formatCurrency(order.totalAmount)} • {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

