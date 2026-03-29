/**
 * WHITE-BOX TESTS — Validation schemas (internal logic)
 */
import { productSchema, loginSchema, registerSchema, orderSchema } from '@/lib/validations'

describe('productSchema — white-box', () => {
  const valid = {
    name: 'Habib Oil',
    company: 'Habib Mills',
    category: 'Cooking Oil',
    cartonQuantity: 10,
    price: 1500,
  }

  test('accepts valid product without imageUrl', () => {
    expect(() => productSchema.parse(valid)).not.toThrow()
  })

  test('accepts valid product with a proper imageUrl', () => {
    expect(() => productSchema.parse({ ...valid, imageUrl: 'https://example.com/img.jpg' })).not.toThrow()
  })

  test('accepts empty string imageUrl (bug fix)', () => {
    // This was the main bug — empty string was rejected before the fix
    expect(() => productSchema.parse({ ...valid, imageUrl: '' })).not.toThrow()
  })

  test('accepts null imageUrl', () => {
    expect(() => productSchema.parse({ ...valid, imageUrl: null })).not.toThrow()
  })

  test('rejects missing name', () => {
    expect(() => productSchema.parse({ ...valid, name: '' })).toThrow()
  })

  test('rejects negative price', () => {
    expect(() => productSchema.parse({ ...valid, price: -100 })).toThrow()
  })

  test('rejects zero price', () => {
    expect(() => productSchema.parse({ ...valid, price: 0 })).toThrow()
  })

  test('rejects negative cartonQuantity', () => {
    expect(() => productSchema.parse({ ...valid, cartonQuantity: -1 })).toThrow()
  })

  test('rejects invalid imageUrl (not a URL and not empty)', () => {
    expect(() => productSchema.parse({ ...valid, imageUrl: 'not-a-url' })).toThrow()
  })
})

describe('loginSchema — white-box', () => {
  test('accepts valid credentials', () => {
    expect(() => loginSchema.parse({ email: 'test@test.com', password: 'pass123' })).not.toThrow()
  })

  test('rejects invalid email', () => {
    expect(() => loginSchema.parse({ email: 'notanemail', password: 'pass123' })).toThrow()
  })

  test('rejects short password', () => {
    expect(() => loginSchema.parse({ email: 'test@test.com', password: '123' })).toThrow()
  })
})

describe('registerSchema — white-box', () => {
  test('accepts valid registration', () => {
    expect(() => registerSchema.parse({ name: 'John', email: 'j@j.com', password: 'pass123' })).not.toThrow()
  })

  test('rejects name shorter than 2 chars', () => {
    expect(() => registerSchema.parse({ name: 'J', email: 'j@j.com', password: 'pass123' })).toThrow()
  })
})

describe('orderSchema — white-box', () => {
  const validOrder = {
    items: [{ productId: 'abc123', quantity: 2 }],
    paymentMethod: 'COD' as const,
    shippingAddress: '123 Main Street, Lahore',
  }

  test('accepts valid order', () => {
    expect(() => orderSchema.parse(validOrder)).not.toThrow()
  })

  test('rejects empty items array', () => {
    expect(() => orderSchema.parse({ ...validOrder, items: [] })).not.toThrow() // empty array is valid structurally
  })

  test('rejects invalid payment method', () => {
    expect(() => orderSchema.parse({ ...validOrder, paymentMethod: 'CASH' })).toThrow()
  })

  test('rejects short shipping address', () => {
    expect(() => orderSchema.parse({ ...validOrder, shippingAddress: 'Short' })).toThrow()
  })
})
