'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import LoadingSpinner from '@/components/LoadingSpinner'

type CartItem = {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    company: string
    price: number
    cartonQuantity: number
  }
}

type Cart = {
  id: string
  items: CartItem[]
  total: number
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    paymentMethod: 'COD',
    shippingAddress: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      setCart(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch cart', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      })

      if (!res.ok) throw new Error('Failed to update')
      fetchCart()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update cart', variant: 'destructive' })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to remove')
      
      toast({ title: 'Removed', description: 'Item removed from cart' })
      fetchCart()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove item', variant: 'destructive' })
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart || cart.items.length === 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod: checkoutForm.paymentMethod,
          shippingAddress: checkoutForm.shippingAddress,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to place order')
      }

      toast({ title: 'Success', description: 'Order placed successfully!' })
      setIsCheckoutOpen(false)
      router.push('/customer/orders')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest-700">Shopping Cart</h1>
        <p className="text-forest-500">Review your items before checkout</p>
      </div>

      {cart && cart.items.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gold-100 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-gold-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-forest-700">{item.product.name}</h3>
                      <p className="text-sm text-forest-500">{item.product.company}</p>
                      <p className="font-semibold text-gold-600">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.cartonQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-forest-700">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-forest-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between text-forest-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-forest-700">
                    <span>Total</span>
                    <span className="text-gold-600">{formatCurrency(cart.total)}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-forest-300" />
            <h3 className="text-xl font-semibold text-forest-700 mb-2">Your cart is empty</h3>
            <p className="text-forest-500 mb-4">Start shopping to add items to your cart</p>
            <Button onClick={() => router.push('/customer/shop')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'COD' })}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    checkoutForm.paymentMethod === 'COD'
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-forest-200 hover:border-forest-300'
                  }`}
                >
                  <Truck className="h-6 w-6 text-gold-600" />
                  <span className="font-medium text-forest-700">Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'CARD' })}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    checkoutForm.paymentMethod === 'CARD'
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-forest-200 hover:border-forest-300'
                  }`}
                >
                  <CreditCard className="h-6 w-6 text-gold-600" />
                  <span className="font-medium text-forest-700">Card Payment</span>
                </button>
              </div>
            </div>
            <div>
              <Label>Shipping Address</Label>
              <Textarea
                value={checkoutForm.shippingAddress}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })}
                placeholder="Enter your full address..."
                rows={3}
                required
              />
            </div>
            <div className="p-4 bg-forest-50 rounded-xl">
              <div className="flex justify-between text-lg font-bold text-forest-700">
                <span>Total</span>
                <span className="text-gold-600">{formatCurrency(cart?.total || 0)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

