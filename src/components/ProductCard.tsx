'use client'

import Image from 'next/image'
import { Droplet, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

type ProductCardProps = {
  product: {
    id: string
    name: string
    company: string
    category: string
    price: number
    cartonQuantity: number
    imageUrl?: string | null
  }
  onAddToCart?: (productId: string, quantity: number) => void
  showAddToCart?: boolean
}

export default function ProductCard({ product, onAddToCart, showAddToCart = true }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product.id, quantity)
      setQuantity(1)
    }
  }

  return (
    <div className="group bg-white rounded-2xl border border-forest-100 shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-forest-100 to-gold-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet className="h-20 w-20 text-gold-400/50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-gold-500 text-forest-900 text-xs font-semibold rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs text-gold-600 font-medium mb-1">{product.company}</p>
        <h3 className="font-display text-lg font-bold text-forest-700 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-forest-600">
            {formatCurrency(product.price)}
          </p>
          <p className="text-sm text-forest-500">
            {product.cartonQuantity} in stock
          </p>
        </div>

        {showAddToCart && (
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center bg-forest-50 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-forest-100 rounded-l-lg transition-colors"
              >
                <Minus className="h-4 w-4 text-forest-600" />
              </button>
              <span className="px-4 py-2 font-semibold text-forest-700">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.cartonQuantity, quantity + 1))}
                className="p-2 hover:bg-forest-100 rounded-r-lg transition-colors"
              >
                <Plus className="h-4 w-4 text-forest-600" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAdd} className="flex-1 gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

