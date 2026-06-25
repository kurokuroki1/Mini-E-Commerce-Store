'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/src/store/cartStore'
import { useAuthStore } from '@/src/store/authStore'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, total } = useCartStore()
  const { token } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => setMounted(true), [])

  async function handleCheckout() {
    if (!token) {
      router.push('/login')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message ?? 'Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-gray-400 text-lg">Your cart is empty.</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-6 bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 text-sm"
        >
          Continue shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4">
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-xs">No img</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg leading-none"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg leading-none"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-semibold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Order total</p>
          <p className="text-2xl font-bold text-gray-900">${total().toFixed(2)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 disabled:bg-gray-400 font-medium"
          >
            {loading ? 'Redirecting...' : 'Checkout with Stripe'}
          </button>
        </div>
      </div>
    </div>
  )
}
