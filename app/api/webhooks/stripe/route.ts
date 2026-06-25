import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/src/lib/stripe'
import { prisma } from '@/src/prisma/client'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig)
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = parseInt(session.metadata?.userId ?? '0')
    const rawItems: { id: number; quantity: number; price: number }[] = JSON.parse(
      session.metadata?.items ?? '[]'
    )

    if (!userId || !rawItems.length) {
      return NextResponse.json({ received: true })
    }

    const total = rawItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PAID',
        stripePaymentId: session.payment_intent as string,
        orderItems: {
          create: rawItems.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    })
  }

  return NextResponse.json({ received: true })
}
