'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

type StockData = {
  name: string
  quantity: number
  company: string
}

const COLORS = ['#D4AF37', '#074C2A', '#B8960F', '#1B9F43', '#8A700B', '#54B772', '#5C4A07', '#8DCFA1']

export default function StockChart() {
  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products')
        const products = await res.json()
        const chartData = products.slice(0, 8).map((p: any) => ({
          name: p.name.split(' ')[0],
          quantity: p.cartonQuantity,
          company: p.company,
        }))
        setData(chartData)
      } catch (error) {
        console.error('Failed to fetch stock data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8F5EC" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#074C2A', fontSize: 12 }}
            axisLine={{ stroke: '#C6E7D0' }}
          />
          <YAxis 
            tick={{ fill: '#074C2A', fontSize: 12 }}
            axisLine={{ stroke: '#C6E7D0' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #C6E7D0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ color: '#074C2A', fontWeight: 'bold' }}
          />
          <Bar dataKey="quantity" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

