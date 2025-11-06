"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { retrieveCart, deleteLineItem } from "@/lib/data/cart"
import { useEffect } from "react"
import { toast } from "@/lib/helpers/toast"

export const ShoppingCart = () => {
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCart()
  }, [])

  const removeCartItem = async (lineItemId: string) => {
    if (removingItems.has(lineItemId)) return // Prevent double-click
    
    setRemovingItems(prev => new Set(prev).add(lineItemId))
    
    try {
      await deleteLineItem(lineItemId)
      toast.success({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
      
      // Refresh cart data
      const updatedCart = await retrieveCart()
      setCart(updatedCart)
      router.refresh()
    } catch (error) {
      toast.error({
        title: "Error removing item",
        description: "Failed to remove item from cart",
      })
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(lineItemId)
        return newSet
      })
    }
  }

  const handleApplyCoupon = () => {
    // Coupon logic here
    console.log("Applying coupon:", couponCode)
  }

  const handleContinueShopping = () => {
    router.push("/container-bestellen")
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Navigate to checkout page
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading cart...</div>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ihr Warenkorb ist leer</h2>
            <p className="text-gray-600 mb-8">Fügen Sie Container zu Ihrem Warenkorb hinzu, um fortzufahren.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded transition-colors"
            >
              Container bestellen
            </button>
          </div>
        </div>
      </div>
    )
  }

  const cartItem = cart.items[0] // For now, show first item
  const subtotal = cart.subtotal || 0
  const total = cart.total || subtotal

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="border border-green-700 text-green-700 p-4 mb-8 flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">
            &ldquo;{cartItem.title}&rdquo; wurde Ihrem Warenkorb hinzugefügt.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">PRODUKT</h2>
              
              {/* Product Card */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="relative w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {cartItem.thumbnail && (
                    <Image
                      src={cartItem.thumbnail}
                      alt={cartItem.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  {/* Remove Button */}
                  <button onClick={() => removeCartItem(cartItem.id)} className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{cartItem.title}</h3>
                  {cartItem.variant && (
                    <>
                      <p className="text-gray-600 mb-2">Variante: {cartItem.variant.title}</p>
                    </>
                  )}
                  
                  {/* Dealer Information */}
                  {cartItem.seller && (
                    <div className="mb-4 bg-yellow-50 p-4 rounded-lg">
                      <p className="text-gray-600 mb-2">Händler: {cartItem.seller.name}</p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <a href="#" className="text-gray-600 hover:text-gray-800 underline">AGB</a>
                        <a href="#" className="text-gray-600 hover:text-gray-800 underline">Widerrufsbelehrung</a>
                        <a href="#" className="text-gray-600 hover:text-gray-800 underline">Datenschutzhinweise</a>
                        <a href="#" className="text-gray-600 hover:text-gray-800 underline">Impressum</a>
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Anzahl:</span> {cartItem.quantity}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">PREIS</p>
                      <p className="text-gray-700">{(cartItem.unit_price).toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">ANZAHL</p>
                      <p className="text-gray-700">{cartItem.quantity}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">ZWISCHENSUMME</p>
                      <p className="text-gray-700">{((cartItem.unit_price * cartItem.quantity)).toFixed(2)} €</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Shopping Button */}
              <button
                onClick={handleContinueShopping}
                className="mt-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Einkauf fortsetzen
              </button>
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">WARENKORB-SUMME</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Zwischensumme</span>
                  <span className="text-gray-900">{(subtotal ).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Versand</span>
                  <span className="text-gray-700">kostenlose Lieferung durch Händler</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900">Gesamtsumme</span>
                    <span className="text-lg font-bold text-gray-900">{(total).toFixed(2)} €</span>
                  </div>
                  <p className="text-sm text-gray-600">inkl. 19 % MwSt.</p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded transition-colors mb-6 flex items-center justify-center"
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wird geladen...
                  </>
                ) : (
                  'Zur Kasse'
                )}
              </button>

              {/* Coupon Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Gutschein</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Gutscheincode"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
                  >
                    Gutschein anwenden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
