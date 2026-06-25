'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/src/store/authStore'

interface OrderItem {
  id: number
  quantity: number
  price: string
  product: { name: string; image: string | null }
}

interface Order {
  id: number
  status: string
  total: string
  createdAt: string
  orderItems: OrderItem[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [token, router])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-32 text-red-500">{error}</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-32 text-gray-400">
        <p>No orders yet.</p>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 text-black underline text-sm"
        >
          Start shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Order #{order.id}</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {order.status}
                </span>
                <p className="font-bold text-gray-900">${parseFloat(order.total).toFixed(2)}</p>
              </div>
            </div>

            <ul className="space-y-1">
              {order.orderItems.map((item) => (
                <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
