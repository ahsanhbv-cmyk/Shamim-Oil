import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creating admin user...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shamimoil.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@shamimoil.com',
      password: adminPassword,
      phone: '+92 300 1234567',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)
  console.log('   Password: admin123')

  console.log('')
  console.log('🎉 Setup completed!')
  console.log('')
  console.log('📝 Login with:')
  console.log('   Email: admin@shamimoil.com')
  console.log('   Password: admin123')
  console.log('')
  console.log('🔐 Admin Registration PIN: ahsan@42101')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
