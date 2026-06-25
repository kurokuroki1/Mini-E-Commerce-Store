'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/src/store/cartStore'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment successful!</h1>
        <p className="text-gray-500 mb-8">
          Your order has been placed. You will receive a confirmation shortly.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800"
          >
            View my orders
          </button>
          <button
            onClick={() => router.push('/products')}
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}
