import Link from 'next/link'
import { Shield, Truck, Users, Phone, Mail, MapPin, Star } from 'lucide-react'
import Logo, { LogoDark } from '@/components/Logo'
import type { ElementType } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-forest-500 via-forest-600 to-forest-700">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gold-500 animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gold-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-gold-300 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={true} />
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="px-6 py-2.5 text-gold-300 hover:text-gold-200 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-gold-400 to-gold-600 text-forest-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full mb-6">
            <Star className="h-4 w-4 text-gold-400" />
            <span className="text-gold-300 text-sm font-medium">Trusted by 1000+ customers</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Premium Quality
            <span className="block text-gold-500 mt-2">Cooking Oils</span>
          </h1>
          <p className="text-xl text-forest-100 max-w-2xl mx-auto mb-10 font-body">
            Your trusted partner for the finest cooking oils, banaspati, and ghee. 
            Delivering excellence with every drop since establishment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="px-8 py-4 bg-gold-500 text-forest-900 font-bold rounded-xl hover:bg-gold-400 transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/40"
            >
              Start Shopping
            </Link>
            <Link 
              href="#features"
              className="px-8 py-4 border-2 border-gold-500 text-gold-500 font-bold rounded-xl hover:bg-gold-500 hover:text-forest-900 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-forest-600 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-forest-500 max-w-2xl mx-auto">
              We provide the best quality products with exceptional service and reliable delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(
              [
                {
                  icon: (() => (
                    <svg viewBox="0 0 100 100" className="w-8 h-8">
                      <path d="M50 5 C50 5 15 45 15 65 C15 85 30 95 50 95 C70 95 85 85 85 65 C85 45 50 5 50 5" fill="#074C2A"/>
                      <text x="50" y="68" textAnchor="middle" fill="#D4AF37" fontWeight="700" fontSize="35">S</text>
                    </svg>
                  )) as ElementType,
                  title: "Premium Quality",
                  description: "Only the finest oils from trusted manufacturers across Pakistan"
                },
                {
                  icon: Shield as ElementType,
                  title: "Quality Assured",
                  description: "All products pass strict quality checks before delivery"
                },
                {
                  icon: Truck as ElementType,
                  title: "Fast Delivery",
                  description: "Quick and reliable delivery to your doorstep within 24-48 hours"
                },
                {
                  icon: Users as ElementType,
                  title: "24/7 Support",
                  description: "Our dedicated team is always here to help you"
                },
              ] as { icon: ElementType; title: string; description: string }[]
            ).map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-2xl bg-gradient-to-br from-forest-50 to-gold-50 hover:from-forest-100 hover:to-gold-100 transition-all hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <feature.icon className="w-8 h-8 text-forest-900" />
                </div>
                <h3 className="font-display text-xl font-bold text-forest-700 mb-3">
                  {feature.title}
                </h3>
                <p className="text-forest-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-24 bg-gradient-to-br from-forest-50 to-gold-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-forest-600 mb-4">
              Our Products
            </h2>
            <p className="text-forest-500 max-w-2xl mx-auto">
              Explore our wide range of premium cooking oils and related products
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Cooking Oil', desc: 'Pure and healthy cooking oils for everyday use', icon: '🫒' },
              { name: 'Banaspati', desc: 'Premium quality banaspati ghee for rich taste', icon: '🧈' },
              { name: 'Desi Ghee', desc: 'Traditional desi ghee for authentic flavors', icon: '🥛' },
            ].map((product, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-5xl mb-4 block">{product.icon}</span>
                <h3 className="font-display text-2xl font-bold text-forest-700 mb-2">{product.name}</h3>
                <p className="text-forest-500 mb-4">{product.desc}</p>
                <Link href="/register" className="text-gold-600 font-semibold hover:text-gold-700">
                  Shop Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-forest-600 to-forest-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gold-500" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-gold-400" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-forest-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Shamim Oil Depo for their cooking oil needs.
          </p>
          <Link 
            href="/register"
            className="inline-block px-10 py-5 bg-gold-500 text-forest-900 font-bold text-lg rounded-xl hover:bg-gold-400 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/40"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-800 text-forest-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo size="sm" showText={true} />
              </div>
              <p className="text-forest-300 text-sm">
                Your trusted partner for premium quality cooking oils since establishment.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-forest-300">
                <li><Link href="/login" className="hover:text-gold-400">Login</Link></li>
                <li><Link href="/register" className="hover:text-gold-400">Register</Link></li>
                <li><Link href="#features" className="hover:text-gold-400">Features</Link></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-forest-300">
                <li><span className="hover:text-gold-400 cursor-pointer">Cooking Oil</span></li>
                <li><span className="hover:text-gold-400 cursor-pointer">Banaspati</span></li>
                <li><span className="hover:text-gold-400 cursor-pointer">Desi Ghee</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3 text-forest-300">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gold-400" />
                  <span>+92 300 1234567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold-400" />
                  <span>info@shamimoil.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gold-400 mt-1" />
                  <span>Lahore, Pakistan</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-forest-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-forest-400 text-sm">
              © 2024 Shamim Oil Depo. All rights reserved.
            </p>
            <p className="text-forest-400 text-sm mt-2 md:mt-0">
              Made with ❤️ in Pakistan
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
