'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/src/store/cartStore'

interface Product {
  id: number
  name: string
  description: string | null
  price: string | number
  image: string | null
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:underline truncate">{product.name}</h3>
        </Link>
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          <button
            disabled={product.stock === 0}
            onClick={() =>
              addItem({ id: product.id, name: product.name, price, image: product.image })
            }
            className="text-sm bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">{product.stock} in stock</p>
      </div>
    </div>
  )
}
