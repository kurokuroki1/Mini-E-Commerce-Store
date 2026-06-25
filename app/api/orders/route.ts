import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/prisma/client'
import { verifyToken } from '@/src/lib/auth'

export async function GET(req: NextRequest) {
  const payload = verifyToken(req)
  if (!payload)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
