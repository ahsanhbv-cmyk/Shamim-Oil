'use client'

import { useEffect, useState } from 'react'
import { Package, ShoppingCart, Users, TrendingUp, Droplet, Boxes, Calendar } from 'lucide-react'
import StockChart from '@/components/StockChart'
import RecentOrders from '@/components/RecentOrders'
import { formatCurrency } from '@/lib/utils'

type DashboardStats = {
  totalProducts: number
  totalOrders: number
  totalEmployees: number
  totalRevenue: number
  pendingOrders: number
  stockEntries: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalEmployees: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    stockEntries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'from-gold-500 to-gold-600',
      bgColor: 'bg-gold-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Stock Entries',
      value: stats.stockEntries,
      icon: Boxes,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-700">
            Admin Dashboard
          </h1>
          <p className="text-forest-500 mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gold-100 rounded-full">
          <Droplet className="h-5 w-5 text-gold-600" />
          <span className="font-semibold text-gold-700">Shamim Oil Depo</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-shadow`}
          >
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
          </div>
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Stock Overview Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-forest-100">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-6">
            Stock Overview
          </h2>
          <StockChart />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-forest-100">
          <h2 className="font-display text-xl font-bold text-forest-700 mb-6">
            Recent Orders
          </h2>
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}

