'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoDark } from '@/components/Logo'
import Logo from '@/components/Logo'

type UserRole = 'CUSTOMER' | 'ADMIN'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' as UserRole,
    adminPin: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminFields, setShowAdminFields] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.role === 'ADMIN' && formData.adminPin !== 'ahsan@42101') {
      setError('Invalid Admin PIN')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
      } else {
        router.push('/login?registered=true')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-gold-500 animate-pulse" />
          <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-gold-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Logo size="xl" showText={false} />
          <h1 className="font-display text-5xl font-bold text-white text-center mb-4 mt-6">
            SHAMIM OIL DEPO
          </h1>
          <p className="text-forest-100 text-xl text-center max-w-md">
            Join us today and experience premium quality oils
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white to-gold-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <LogoDark size="lg" showText={true} />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-forest-200/50 p-8">
            <h2 className="font-display text-3xl font-bold text-forest-700 mb-2">
              Create Account
            </h2>
            <p className="text-forest-500 mb-8">
              Register to start ordering
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="mb-2 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-12"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-12"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-12"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 pr-12"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-forest-400" />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Admin Registration Toggle */}
              <div className="border-t border-forest-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminFields(!showAdminFields)
                    setFormData({ ...formData, role: showAdminFields ? 'CUSTOMER' : 'ADMIN' })
                  }}
                  className="flex items-center gap-2 text-sm text-forest-500 hover:text-forest-700"
                >
                  <Shield className="h-4 w-4" />
                  {showAdminFields ? 'Cancel Admin Registration' : 'Register as Admin'}
                </button>
              </div>

              {showAdminFields && (
                <div className="p-4 bg-forest-50 rounded-xl border border-forest-200">
                  <Label className="mb-2 block">Admin Secret PIN</Label>
                  <Input
                    type="password"
                    value={formData.adminPin}
                    onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                    placeholder="Enter admin secret PIN"
                  />
                  <p className="mt-2 text-xs text-forest-500">
                    Contact existing admin for the secret PIN
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-forest-500">
                Already have an account?{' '}
                <Link href="/login" className="text-gold-600 font-semibold hover:text-gold-700">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
