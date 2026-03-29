/**
 * BLACK-BOX TESTS — Products API (external behavior)
 * Mocks Prisma and NextAuth to test API routes in isolation
 */

// Mock next-auth
jest.mock('next-auth', () => ({ default: jest.fn() }))
jest.mock('next-auth/providers/credentials', () => jest.fn())

// Mock getServerSession
const mockGetServerSession = jest.fn()
jest.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}))

// Mock Prisma
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}
jest.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))
jest.mock('@/lib/auth', () => ({ authOptions: {} }))

import { GET, POST, PUT, DELETE } from '@/app/api/products/route'
import { NextRequest } from 'next/server'

const adminSession = { user: { role: 'ADMIN', id: 'admin1' } }
const customerSession = { user: { role: 'CUSTOMER', id: 'cust1' } }

const makeRequest = (method: string, body?: object, url = 'http://localhost/api/products') => {
  return new NextRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── GET ────────────────────────────────────────────────────────────────────

describe('GET /api/products', () => {
  test('returns product list', async () => {
    const products = [{ id: '1', name: 'Habib Oil', price: 1500 }]
    mockPrisma.product.findMany.mockResolvedValue(products)

    const res = await GET(makeRequest('GET'))
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(products)
  })

  test('filters by category query param', async () => {
    mockPrisma.product.findMany.mockResolvedValue([])
    const req = makeRequest('GET', undefined, 'http://localhost/api/products?category=Ghee')

    await GET(req)

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ category: 'Ghee' }) })
    )
  })

  test('returns 500 on DB error', async () => {
    mockPrisma.product.findMany.mockRejectedValue(new Error('DB down'))
    const res = await GET(makeRequest('GET'))
    expect(res.status).toBe(500)
  })
})

// ─── POST ───────────────────────────────────────────────────────────────────

describe('POST /api/products', () => {
  const validProduct = {
    name: 'Habib Oil',
    company: 'Habib Mills',
    category: 'Cooking Oil',
    cartonQuantity: 10,
    price: 1500,
    imageUrl: '',
  }

  test('creates product as admin', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    mockPrisma.product.create.mockResolvedValue({ id: '1', ...validProduct, imageUrl: null })

    const res = await POST(makeRequest('POST', validProduct))
    expect(res.status).toBe(201)
  })

  test('normalizes empty imageUrl to null', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    mockPrisma.product.create.mockResolvedValue({ id: '1', ...validProduct, imageUrl: null })

    await POST(makeRequest('POST', { ...validProduct, imageUrl: '' }))

    expect(mockPrisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ imageUrl: null }) })
    )
  })

  test('returns 401 for non-admin', async () => {
    mockGetServerSession.mockResolvedValue(customerSession)
    const res = await POST(makeRequest('POST', validProduct))
    expect(res.status).toBe(401)
  })

  test('returns 401 when not logged in', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await POST(makeRequest('POST', validProduct))
    expect(res.status).toBe(401)
  })

  test('returns 400 for missing name', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    const res = await POST(makeRequest('POST', { ...validProduct, name: '' }))
    expect(res.status).toBe(400)
  })

  test('returns 400 for negative price', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    const res = await POST(makeRequest('POST', { ...validProduct, price: -100 }))
    expect(res.status).toBe(400)
  })

  test('returns 400 for invalid imageUrl', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    const res = await POST(makeRequest('POST', { ...validProduct, imageUrl: 'not-a-url' }))
    expect(res.status).toBe(400)
  })
})

// ─── PUT ────────────────────────────────────────────────────────────────────

describe('PUT /api/products', () => {
  const updatePayload = {
    id: 'prod1',
    name: 'Updated Oil',
    company: 'Habib Mills',
    category: 'Cooking Oil',
    cartonQuantity: 20,
    price: 2000,
    imageUrl: '',
  }

  test('updates product as admin', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    mockPrisma.product.update.mockResolvedValue({ ...updatePayload, imageUrl: null })

    const res = await PUT(makeRequest('PUT', updatePayload))
    expect(res.status).toBe(200)
  })

  test('normalizes empty imageUrl to null on update', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    mockPrisma.product.update.mockResolvedValue({ ...updatePayload, imageUrl: null })

    await PUT(makeRequest('PUT', { ...updatePayload, imageUrl: '' }))

    expect(mockPrisma.product.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ imageUrl: null }) })
    )
  })

  test('returns 401 for non-admin', async () => {
    mockGetServerSession.mockResolvedValue(customerSession)
    const res = await PUT(makeRequest('PUT', updatePayload))
    expect(res.status).toBe(401)
  })

  test('returns 400 when id is missing', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    const { id, ...noId } = updatePayload
    const res = await PUT(makeRequest('PUT', noId))
    expect(res.status).toBe(400)
  })

  test('returns 400 for invalid data', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    const res = await PUT(makeRequest('PUT', { ...updatePayload, price: -1 }))
    expect(res.status).toBe(400)
  })
})

// ─── DELETE ─────────────────────────────────────────────────────────────────

describe('DELETE /api/products', () => {
  test('deletes product as admin', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    mockPrisma.product.delete.mockResolvedValue({})

    const req = makeRequest('DELETE', undefined, 'http://localhost/api/products?id=prod1')
    const res = await DELETE(req)
    expect(res.status).toBe(200)
  })

  test('returns 400 when id is missing', async () => {
    mockGetServerSession.mockResolvedValue(adminSession)
    const res = await DELETE(makeRequest('DELETE'))
    expect(res.status).toBe(400)
  })

  test('returns 401 for non-admin', async () => {
    mockGetServerSession.mockResolvedValue(customerSession)
    const res = await DELETE(makeRequest('DELETE', undefined, 'http://localhost/api/products?id=prod1'))
    expect(res.status).toBe(401)
  })
})
