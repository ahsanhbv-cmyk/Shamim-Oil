'use client'

import { useEffect, useState } from 'react'
import { Plus, DollarSign, Package, FileText, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

type Product = {
  id: string
  name: string
  company: string
}

type StockEntry = {
  id: string
  product: { name: string; company: string } | null
  itemDescription: string | null
  quantityReceived: number
  totalBill: number
  supplierName: string | null
  arrivalDate: string
  totalPaid: number
  remainingDue: number
  payments: { id: string; amountPaid: number; datePaid: string }[]
}

type SupplierSummary = {
  name: string
  totalBills: number
  totalAmount: number
  totalPaid: number
  totalDue: number
  entries: StockEntry[]
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<StockEntry | null>(null)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'supplier'>('all')
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  
  const [stockForm, setStockForm] = useState({
    productId: '',
    quantityReceived: 0,
    totalBill: 0,
    supplierName: '',
  })
  
  const [paymentForm, setPaymentForm] = useState({
    stockEntryId: '',
    amountPaid: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [prodRes, stockRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/stock'),
      ])
      
      const prodData = await prodRes.json()
      const stockData = await stockRes.json()
      
      setProducts(Array.isArray(prodData) ? prodData : [])
      setStockEntries(Array.isArray(stockData) ? stockData : [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group entries by supplier
  const supplierSummaries: SupplierSummary[] = stockEntries.reduce((acc: SupplierSummary[], entry) => {
    const supplierName = entry.supplierName || 'Unknown Supplier'
    let supplier = acc.find(s => s.name === supplierName)
    
    if (!supplier) {
      supplier = {
        name: supplierName,
        totalBills: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0,
        entries: []
      }
      acc.push(supplier)
    }
    
    supplier.totalBills += 1
    supplier.totalAmount += entry.totalBill
    supplier.totalPaid += entry.totalPaid
    supplier.totalDue += entry.remainingDue
    supplier.entries.push(entry)
    
    return acc
  }, [])

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stockForm.productId) {
      alert('Please select a product')
      return
    }
    if (!stockForm.supplierName.trim()) {
      alert('Please enter supplier name')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stockForm),
      })

      if (!res.ok) throw new Error('Failed to add stock')

      alert('Bill added successfully!')
      setIsStockDialogOpen(false)
      setStockForm({ productId: '', quantityReceived: 0, totalBill: 0, supplierName: stockForm.supplierName })
      fetchData()
    } catch (error) {
      alert('Failed to add bill')
    } finally {
      setSaving(false)
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/stock/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add payment')
      }

      alert('Payment added successfully!')
      setIsPaymentDialogOpen(false)
      setPaymentForm({ stockEntryId: '', amountPaid: 0 })
      fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add payment')
    } finally {
      setSaving(false)
    }
  }

  const openPaymentDialog = (entry: StockEntry) => {
    setSelectedEntry(entry)
    setPaymentForm({ stockEntryId: entry.id, amountPaid: 0 })
    setIsPaymentDialogOpen(true)
  }

  const addBillForSupplier = (supplierName: string) => {
    setStockForm({ ...stockForm, supplierName })
    setIsStockDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">Stock & Bills Management</h1>
          <p className="text-forest-500">Track stock entries, bills, and payments by supplier</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-xl overflow-hidden border-2 border-forest-200">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'all' 
                  ? 'bg-gold-500 text-forest-900' 
                  : 'bg-white text-forest-600 hover:bg-forest-50'
              }`}
            >
              All Bills
            </button>
            <button
              onClick={() => setViewMode('supplier')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'supplier' 
                  ? 'bg-gold-500 text-forest-900' 
                  : 'bg-white text-forest-600 hover:bg-forest-50'
              }`}
            >
              By Supplier
            </button>
          </div>
          <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add New Bill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Bill / Stock Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStock} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Supplier Name *</Label>
                  <Input
                    value={stockForm.supplierName}
                    onChange={(e) => setStockForm({ ...stockForm, supplierName: e.target.value })}
                    placeholder="Enter supplier name"
                    required
                    list="suppliers"
                  />
                  <datalist id="suppliers">
                    {supplierSummaries.map((s) => (
                      <option key={s.name} value={s.name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label className="mb-2 block">Select Product *</Label>
                  <select
                    value={stockForm.productId}
                    onChange={(e) => setStockForm({ ...stockForm, productId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border-2 border-forest-200 bg-white focus:border-gold-500 focus:outline-none"
                    required
                  >
                    <option value="">-- Select Product --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.company}
                      </option>
                    ))}
                  </select>
                  {products.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">No products available. Add products first.</p>
                  )}
                </div>
                <div>
                  <Label className="mb-2 block">Quantity Received (Cartons) *</Label>
                  <Input
                    type="number"
                    value={stockForm.quantityReceived}
                    onChange={(e) => setStockForm({ ...stockForm, quantityReceived: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Bill Amount (PKR) *</Label>
                  <Input
                    type="number"
                    value={stockForm.totalBill}
                    onChange={(e) => setStockForm({ ...stockForm, totalBill: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsStockDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={saving || products.length === 0}>
                    {saving ? 'Adding...' : 'Add Bill'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Supplier Summary Cards */}
      {viewMode === 'supplier' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supplierSummaries.map((supplier) => (
            <Card key={supplier.name} className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedSupplier === supplier.name ? 'ring-2 ring-gold-500' : ''
            }`} onClick={() => setSelectedSupplier(selectedSupplier === supplier.name ? null : supplier.name)}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-forest-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-700">{supplier.name}</h3>
                      <p className="text-sm text-forest-500">{supplier.totalBills} bills</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      addBillForSupplier(supplier.name)
                    }}
                    className="gap-1"
                  >
                    <FileText className="h-4 w-4" /> Add Bill
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600">Total</p>
                    <p className="font-bold text-blue-700">{formatCurrency(supplier.totalAmount)}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600">Paid</p>
                    <p className="font-bold text-green-700">{formatCurrency(supplier.totalPaid)}</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">Due</p>
                    <p className="font-bold text-red-700">{formatCurrency(supplier.totalDue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {supplierSummaries.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center text-forest-500">
                No suppliers yet. Add your first bill!
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gold-500" />
            {viewMode === 'supplier' && selectedSupplier 
              ? `Bills from ${selectedSupplier}` 
              : 'All Bills / Stock Entries'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Bill Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockEntries
                  .filter(entry => 
                    viewMode === 'all' || !selectedSupplier || entry.supplierName === selectedSupplier
                  )
                  .map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <span className="font-medium text-forest-700">{entry.supplierName || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{entry.product?.name || entry.itemDescription || 'N/A'}</p>
                      <p className="text-xs text-forest-500">{entry.product?.company || ''}</p>
                    </TableCell>
                    <TableCell className="text-right">{entry.quantityReceived}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(entry.totalBill)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(entry.totalPaid)}</TableCell>
                    <TableCell className="text-right">
                      <span className={entry.remainingDue > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {formatCurrency(entry.remainingDue)}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(entry.arrivalDate)}</TableCell>
                    <TableCell className="text-right">
                      {entry.remainingDue > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openPaymentDialog(entry)}
                        >
                          <DollarSign className="h-4 w-4" /> Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {stockEntries.length === 0 && (
            <div className="text-center py-12 text-forest-500">
              No bills found. Add your first bill!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div className="p-4 bg-forest-50 rounded-xl space-y-2">
                <p className="font-semibold text-forest-700">{selectedEntry.supplierName}</p>
                <p className="text-sm text-forest-600">{selectedEntry.product?.name || selectedEntry.itemDescription || 'N/A'}</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div>
                    <p className="text-xs text-forest-500">Bill Amount</p>
                    <p className="font-semibold">{formatCurrency(selectedEntry.totalBill)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-forest-500">Paid</p>
                    <p className="font-semibold text-green-600">{formatCurrency(selectedEntry.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-forest-500">Remaining</p>
                    <p className="font-semibold text-red-600">{formatCurrency(selectedEntry.remainingDue)}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Payment Amount (PKR)</Label>
                <Input
                  type="number"
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                  min={1}
                  max={selectedEntry.remainingDue}
                  required
                />
                <p className="text-xs text-forest-500 mt-1">
                  Maximum: {formatCurrency(selectedEntry.remainingDue)}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Payment'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
