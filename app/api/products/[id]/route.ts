import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/prisma/client'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const productId = parseInt(id)
  if (isNaN(productId))
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
