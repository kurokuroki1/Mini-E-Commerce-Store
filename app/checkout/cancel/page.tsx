'use client'

import { useRouter } from 'next/navigation'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-gray-500 mb-8">Your cart is still saved. You can try again anytime.</p>
        <button
          onClick={() => router.push('/cart')}
          className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800"
        >
          Back to cart
        </button>
      </div>
    </div>
  )
}
