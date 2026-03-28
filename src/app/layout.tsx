import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import AuthProvider from '@/components/AuthProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shamim Oil Depo - Premium Quality Oils',
  description: 'Your trusted partner for premium quality cooking oils and lubricants. Order online and get fast delivery.',
  keywords: ['oil', 'cooking oil', 'banaspati', 'ghee', 'wholesale', 'Pakistan'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-gold-50">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

