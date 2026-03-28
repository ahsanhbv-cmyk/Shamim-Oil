import { Role, OrderStatus, AttendanceStatus } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: Role
    }
  }
  interface User {
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    id: string
  }
}

export type NavItem = {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

export type DashboardStats = {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

export type ProductWithStock = {
  id: string
  name: string
  company: string
  category: string
  cartonQuantity: number
  price: number
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type OrderWithDetails = {
  id: string
  customerId: string
  customer: {
    name: string
    email: string
    phone: string | null
  }
  totalAmount: number
  status: OrderStatus
  confirmationSent: boolean
  customerApproved: boolean
  paymentMethod: string | null
  shippingAddress: string | null
  createdAt: Date
  updatedAt: Date
  orderItems: {
    id: string
    quantity: number
    price: number
    product: {
      name: string
      company: string
    }
  }[]
}

export type EmployeeWithAttendance = {
  id: string
  name: string
  email: string
  phone: string | null
  employeeSalary: number | null
  attendance: {
    date: Date
    status: AttendanceStatus
  }[]
}

export type StockEntryWithDetails = {
  id: string
  productId: string
  product: {
    name: string
    company: string
  }
  quantityReceived: number
  totalBill: number
  supplierName: string | null
  arrivalDate: Date
  createdAt: Date
  payments: {
    id: string
    amountPaid: number
    datePaid: Date
  }[]
}

