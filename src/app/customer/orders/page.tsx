'use client'

import { useEffect, useState } from 'react'
import { Package, Check, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils'
import LoadingSpinner from '@/components/LoadingSpinner'

type OrderItem = {
  id: string
  quantity: number
  price: number
  product: {
    name: string
    company: string
  }
}

type Order = {
  id: string
  totalAmount: number
  status: string
  confirmationSent: boolean
  customerApproved: boolean
  paymentMethod: string | null
  shippingAddress: string | null
  createdAt: string
  orderItems: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const approveOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action: 'approve' }),
      })

      if (!res.ok) throw new Error('Failed to approve')

      toast({ title: 'Success', description: 'Order approved for dispatch!' })
      fetchOrders()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve order', variant: 'destructive' })
    }
  }

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to cancel')
      }

      toast({ title: 'Cancelled', description: 'Order has been cancelled' })
      fetchOrders()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel order',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest-700">My Orders</h1>
        <p className="text-forest-500">Track and manage your orders</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-forest-700">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-forest-500">
                        {order.orderItems.length} items • {formatDateTime(order.createdAt)}
                      </p>
                      <p className="text-lg font-bold text-gold-600 mt-1">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    
                    {/* Show approval button if confirmation sent and not yet approved */}
                    {order.confirmationSent && !order.customerApproved && (
                      <div className="p-3 bg-gold-50 rounded-lg border border-gold-200 text-center">
                        <p className="text-sm text-gold-700 mb-2">
                          Your order is ready for dispatch. Please approve.
                        </p>
                        <Button size="sm" onClick={() => approveOrder(order.id)} className="gap-1">
                          <Check className="h-4 w-4" /> Approve Dispatch
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 mr-1" /> Details
                      </Button>
                      {!['DISPATCHED', 'DELIVERED'].includes(order.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelOrder(order.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-forest-300" />
            <h3 className="text-xl font-semibold text-forest-700 mb-2">No orders yet</h3>
            <p className="text-forest-500">Start shopping to place your first order</p>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-forest-500">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-500">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-forest-500">Payment Method</p>
                  <p className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-500">Order Date</p>
                  <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-sm text-forest-500">Shipping Address</p>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-forest-500 mb-2">Order Items</p>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-forest-500">{item.product.company}</p>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gold-50 rounded-xl">
                <span className="font-semibold text-forest-700">Total Amount</span>
                <span className="text-2xl font-bold text-gold-600">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

