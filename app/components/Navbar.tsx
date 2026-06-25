'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/src/store/cartStore'
import { useAuthStore } from '@/src/store/authStore'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()
  const count = useCartStore((s) => s.count)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const cartCount = mounted ? count() : 0

  function handleLogout() {
    clearAuth()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link href="/products" className="text-xl font-bold text-gray-900">
        ShopApp
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <Link href="/products" className="hover:text-gray-900">Products</Link>

        <Link href="/cart" className="relative hover:text-gray-900">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {mounted && user ? (
          <>
            <Link href="/orders" className="hover:text-gray-900">Orders</Link>
            <button
              onClick={handleLogout}
              className="hover:text-gray-900"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-900">Login</Link>
            <Link
              href="/register"
              className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-800"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
