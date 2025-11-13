"use client"

import { useEffect, useState, useCallback } from "react"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { CartAddressSection } from "../CartAddressSection/CartAddressSection"
import CartShippingMethodsSection from "../CartShippingMethodsSection/CartShippingMethodsSection"
import CartPaymentSection from "../CartPaymentSection/CartPaymentSection"
import { useSearchParams } from "next/navigation"
import PaymentWrapper from "@/components/organisms/PaymentContainer/PaymentWrapper"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { listCartShippingMethods } from "@/lib/data/fulfillment"

export const CheckoutForm = () => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<any[] | null>(null)
  const [shippingMethods, setShippingMethods] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "address"

  // Function to reload cart data
  const reloadCart = useCallback(async () => {
    try {
      const cartData = await retrieveCart()
      setCart(cartData)
      
      // Reload shipping methods when cart updates
      if (cartData?.id) {
        const shipMethods = await listCartShippingMethods(cartData.id)
        setShippingMethods(shipMethods)
      }
    } catch (error) {
      console.error('Error reloading cart:', error)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartData, customerData] = await Promise.all([
          retrieveCart(),
          retrieveCustomer().catch(() => null)
        ])
        setCart(cartData)
        setCustomer(customerData)
        
        // Load payment methods if cart has a region
        if (cartData?.region_id) {
          const methods = await listCartPaymentMethods(cartData.region_id)
          setPaymentMethods(methods)
        }

        // Load shipping methods if cart exists
        if (cartData?.id) {
          const shipMethods = await listCartShippingMethods(cartData.id)
          setShippingMethods(shipMethods)
        }
      } catch (error) {
        console.error('Error loading checkout data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Reload cart when step changes
  useEffect(() => {
    if (!loading && cart) {
      reloadCart()
    }
  }, [step, loading])

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading checkout...</div>
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <PaymentWrapper cart={cart}>
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kasse</h1>
          
              <div className="space-y-8">
              {/* Step 1: Address */}
              <CartAddressSection cart={cart} customer={customer} />
              
              {/* Step 2: Shipping Methods */}
              {cart.shipping_address && (
                <CartShippingMethodsSection
                  cart={cart}
                  availableShippingMethods={shippingMethods as any}
                />
              )}
              
              {/* Step 3: Payment & Place Order */}
              {cart.shipping_address && cart.shipping_methods && cart.shipping_methods.length > 0 && (
                <CartPaymentSection cart={cart} availablePaymentMethods={paymentMethods} />
              )}
                </div>
              </div>
            </div>
        </div>
    </PaymentWrapper>
  )
}
