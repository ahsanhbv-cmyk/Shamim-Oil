import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
})

export const adminRegisterSchema = registerSchema.extend({
  pin: z.string().length(4, "PIN must be 4 digits"),
})

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  company: z.string().min(2, "Company name is required"),
  category: z.string().min(2, "Category is required"),
  cartonQuantity: z.number().min(0, "Quantity cannot be negative"),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().url().optional().nullable(),
})

export const stockEntrySchema = z.object({
  productId: z.string(),
  quantityReceived: z.number().positive("Quantity must be positive"),
  totalBill: z.number().positive("Total bill must be positive"),
  supplierName: z.string().optional(),
  arrivalDate: z.string().optional(),
})

export const stockPaymentSchema = z.object({
  stockEntryId: z.string(),
  amountPaid: z.number().positive("Payment must be positive"),
})

export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
  })),
  paymentMethod: z.enum(["COD", "CARD"]),
  shippingAddress: z.string().min(10, "Please enter a valid address"),
})

export const orderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(["NEW", "PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED"]),
})

export const employeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  salary: z.number().positive("Salary must be positive"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const attendanceSchema = z.object({
  employeeId: z.string(),
  date: z.string(),
  status: z.enum(["PRESENT", "ABSENT"]),
})

export const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
})

export const replySchema = z.object({
  messageId: z.string(),
  reply: z.string().min(1, "Reply cannot be empty"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type StockEntryInput = z.infer<typeof stockEntrySchema>
export type StockPaymentInput = z.infer<typeof stockPaymentSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type EmployeeInput = z.infer<typeof employeeSchema>
export type AttendanceInput = z.infer<typeof attendanceSchema>
export type MessageInput = z.infer<typeof messageSchema>

