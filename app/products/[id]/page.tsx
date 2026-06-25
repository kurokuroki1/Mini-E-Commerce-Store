'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/src/store/cartStore'

interface Product {
  id: number
  name: string
  description: string | null
  price: string
  image: string | null
  stock: number
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setProduct)
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 flex gap-10">
        <div className="w-96 h-80 bg-gray-100 rounded-xl animate-pulse" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-32 text-gray-400">
        <p>{error || 'Product not found.'}</p>
        <button onClick={() => router.push('/products')} className="mt-4 text-black underline text-sm">
          Back to products
        </button>
      </div>
    )
  }

  const price = parseFloat(product.price)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <button
        onClick={() => router.push('/products')}
        className="text-sm text-gray-500 hover:text-gray-900 mb-8 flex items-center gap-1"
      >
        ← Back to products
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="relative w-full md:w-96 h-80 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No image</div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.description && (
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
          )}
          <p className="mt-6 text-3xl font-bold text-gray-900">${price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-gray-400">{product.stock} in stock</p>

          <button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="mt-8 w-full md:w-auto bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {added ? 'Added!' : product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
