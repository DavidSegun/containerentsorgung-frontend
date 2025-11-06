"use client"

import Image from "next/image"
import { Button } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { BaseHit, Hit } from "instantsearch.js"
import clsx from "clsx"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { useRouter, useParams } from "next/navigation"

export const ProductCard = ({
  product,
  api_product,
}: {
  product: Hit<HttpTypes.StoreProduct> | Partial<Hit<BaseHit>>
  api_product?: HttpTypes.StoreProduct | null
}) => {
  const router = useRouter()
  const params = useParams() as { locale?: string }
  const locale = params?.locale || ""
  
  if (!api_product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: api_product! as HttpTypes.StoreProduct,
  })

  const productName = String(product.title || "Product")
  const imageSrc =
    (api_product as any)?.thumbnail ||
    (api_product as any)?.images?.[0]?.url ||
    (product as any)?.thumbnail ||
    "/images/placeholder.svg"

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Click handler called!')
    console.log('Product handle:', product.handle)
    console.log('Locale:', locale)
    console.log('Full product:', product)
    if (product.handle) {
      const url = `/${locale}/products/${product.handle}`
      console.log('Navigating to:', url)
      
      // Try router.push first
      router.push(url)
      
      // Fallback: force navigation after a short delay
      setTimeout(() => {
        console.log('Fallback navigation triggered')
        window.location.href = url
      }, 100)
    } else {
      console.error('No product handle found')
    }
  }

  return (
    <div 
      className="bg-transparent cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Top Section - Illustration */}
      <div className="bg-transparent p-4 border border-gray-300 mb-4 h-48 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center relative">
          <Image
            priority
            fetchPriority="high"
            src={imageSrc}
            alt={`${productName} image`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Bottom Section - Text Details */}
      <div className="bg-transparent px-0 pb-0">
        <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
          {product.title}
        </h3>
        <div className="text-gray-900 text-sm">
          <span className="text-yellow-500 font-bold">{cheapestPrice?.calculated_price}</span>
          {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
            <span className="text-gray-500 line-through ml-2">
              {cheapestPrice?.original_price}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
