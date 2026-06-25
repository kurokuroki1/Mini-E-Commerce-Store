import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/prisma/client'
import { verifyToken } from '@/src/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  try {
    const products = await prisma.product.findMany({
      where: {
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
        price: {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  const user = verifyToken(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, description, price, image, stock } = await req.json()
  if (!name || price === undefined) return NextResponse.json({ error: 'name and price are required' }, { status: 400 })

  try {
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image, stock: stock ?? 0 },
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}