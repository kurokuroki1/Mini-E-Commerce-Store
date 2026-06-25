import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/src/lib/auth'
import { stripe } from '@/src/lib/stripe'

interface CartItemPayload {
  id: number
  name: string
  price: number
  quantity: number
  image: string | null
}

export async function POST(req: NextRequest) {
  const payload = verifyToken(req)
  if (!payload)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items }: { items: CartItemPayload[] } = await req.json()
  if (!items?.length)
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        userId: String(payload.userId),
        items: JSON.stringify(
          items.map(({ id, quantity, price }) => ({ id, quantity, price }))
        ),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
