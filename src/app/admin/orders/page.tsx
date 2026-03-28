'use client'

import { useEffect, useState } from 'react'
import { Search, Eye, Send, Check, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  customer: {
    name: string
    email: string
    phone: string | null
  }
  totalAmount: number
  status: string
  confirmationSent: boolean
  customerApproved: boolean
  paymentMethod: string | null
  shippingAddress: string | null
  createdAt: string
  orderItems: OrderItem[]
}

const statusOptions = ['NEW', 'PENDING', 'CONFIRMED', 'DISPATCHED', 'DELIVERED']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      
      const res = await fetch(`/api/orders?${params}`)
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      
      if (!res.ok) throw new Error('Failed to update')
      
      toast({ title: 'Success', description: 'Order status updated' })
      fetchOrders()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' })
    }
  }

  const sendConfirmation = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, confirmationSent: true }),
      })
      
      if (!res.ok) throw new Error('Failed to send')
      
      toast({ title: 'Success', description: 'Confirmation sent to customer' })
      fetchOrders()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send confirmation', variant: 'destructive' })
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">Orders</h1>
          <p className="text-forest-500">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confirmation</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-forest-700">{order.customer.name}</p>
                      <p className="text-xs text-forest-500">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {order.customerApproved ? (
                      <Badge variant="success">Approved</Badge>
                    ) : order.confirmationSent ? (
                      <Badge variant="warning">Sent</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-forest-500">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!order.confirmationSent && order.status === 'CONFIRMED' && (
                        <Button size="icon" variant="ghost" onClick={() => sendConfirmation(order.id)} title="Send Dispatch Confirmation">
                          <Send className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      {order.customerApproved && order.status !== 'DISPATCHED' && order.status !== 'DELIVERED' && (
                        <Button size="icon" variant="ghost" onClick={() => updateOrderStatus(order.id, 'DISPATCHED')} title="Mark as Dispatched">
                          <Truck className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && (
            <div className="text-center py-12 text-forest-500">
              No orders found
            </div>
          )}
        </CardContent>
      </Card>

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
                  <p className="text-sm text-forest-500">Customer</p>
                  <p className="font-semibold">{selectedOrder.customer.name}</p>
                  <p className="text-sm">{selectedOrder.customer.email}</p>
                  <p className="text-sm">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-forest-500">Order Info</p>
                  <p className="font-semibold">{formatCurrency(selectedOrder.totalAmount)}</p>
                  <p className="text-sm">{selectedOrder.paymentMethod || 'N/A'}</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
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

              <div className="flex gap-2">
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    updateOrderStatus(selectedOrder.id, value)
                    setSelectedOrder({ ...selectedOrder, status: value })
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

