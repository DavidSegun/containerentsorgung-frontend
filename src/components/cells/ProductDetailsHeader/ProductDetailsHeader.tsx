"use client"

import { Button } from "@/components/atoms"
import { HttpTypes } from "@medusajs/types"
import { ProductVariants } from "@/components/molecules"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import { useState, useEffect } from "react"
import { addToCart } from "@/lib/data/cart"
import { Chat } from "@/components/organisms/Chat/Chat"
import { SellerProps } from "@/types/seller"
import { WishlistButton } from "../WishlistButton/WishlistButton"
import { Wishlist } from "@/types/wishlist"
import { toast } from "@/lib/helpers/toast"
import { LabeledInput } from "@/components/cells"
import { getProductBookedDates } from "@/lib/data/availability"

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (
      acc: Record<string, string>,
      varopt: HttpTypes.StoreProductOptionValue
    ) => {
      acc[varopt.option?.title.toLowerCase() || ""] = varopt.value

      return acc
    },
    {}
  )
}

export const ProductDetailsHeader = ({
  product,
  locale,
  user,
  wishlist,
}: {
  product: HttpTypes.StoreProduct & { seller?: SellerProps }
  locale: string
  user: HttpTypes.StoreCustomer | null
  wishlist?: Wishlist[]
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [installationLocation, setInstallationLocation] = useState("")
  const [containerExchange, setContainerExchange] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [loadingDates, setLoadingDates] = useState(true)
  const { allSearchParams } = useGetAllSearchParams()

  // Fetch booked dates on component mount
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const dates = await getProductBookedDates(product.id)
        setBookedDates(dates)
      } catch (error) {
        console.error("Error loading booked dates:", error)
      } finally {
        setLoadingDates(false)
      }
    }
    fetchBookedDates()
  }, [product.id])

  const { cheapestVariant } = getProductPrice({
    product,
  })
  // set default variant
  const selectedVariant = {
    ...optionsAsKeymap(cheapestVariant.options ?? null),
    ...allSearchParams,
  }

  // get selected variant id
  const variantId =
    product.variants?.find(({ options }: { options: any }) =>
      options?.every((option: any) =>
        selectedVariant[option.option?.title.toLowerCase() || ""]?.includes(
          option.value
        )
      )
    )?.id || ""

  // get variant price
  const { variantPrice } = getProductPrice({
    product,
    variantId,
  })

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variantId) return null
    
    // Prevent double-click
    if (isAdding) return

    // Validate required fields
    if (!deliveryDate || !installationLocation || !contactName || !contactPhone) {
      toast.error({
        title: "Missing required fields",
        description: "Please fill in delivery date, installation location, contact name, and phone number",
      })
      return
    }

    // Check if selected date is already booked
    if (bookedDates.includes(deliveryDate)) {
      toast.error({
        title: "Date unavailable",
        description: "This delivery date is already booked. Please select another date.",
      })
      return
    }

    setIsAdding(true)

    try {
      await addToCart({
        variantId: variantId,
        quantity: quantity,
        countryCode: locale,
        metadata: {
          delivery_date: deliveryDate,
          installation_location: installationLocation,
          container_exchange: containerExchange,
          contact_name: contactName,
          contact_phone: contactPhone,
        },
      })
      
      toast.success({
        title: "Added to cart",
        description: "Product has been added to your cart",
      })
      
      // Clear form after successful add (with small delay to show success)
      setTimeout(() => {
        setQuantity(1)
        setDeliveryDate("")
        setInstallationLocation("")
        setContainerExchange("")
        setContactName("")
        setContactPhone("")
      }, 500)
    } catch (error) {
      toast.error({
        title: "Error adding to cart",
        description: "Some variant does not have the required inventory",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const variantStock =
    product.variants?.find(({ id }) => id === variantId)?.inventory_quantity ||
    0

  const variantHasPrice = product.variants?.find(({ id }) => id === variantId)
    ?.calculated_price
    ? true
    : false

  return (
    <div className="border rounded-sm p-5">
      <div className="flex justify-between">
        <div>
          <h2 className="label-md text-secondary">
            {/* {product?.brand || "No brand"} */}
          </h2>
          <h1 className="heading-lg text-primary">{product.title}</h1>
          <div className="mt-2 flex gap-2 items-center">
            <span className="heading-md text-primary">
              {variantPrice?.calculated_price}
            </span>
            {variantPrice?.calculated_price_number !==
              variantPrice?.original_price_number && (
              <span className="label-md text-secondary line-through">
                {variantPrice?.original_price}
              </span>
            )}
          </div>
        </div>
        <div>
          {/* Add to Wishlist */}
          <WishlistButton
            productId={product.id}
            wishlist={wishlist}
            user={user}
          />
        </div>
      </div>
      {/* Product Variants */}
      <ProductVariants product={product} selectedVariant={selectedVariant} />
      
      {/* Cart Item Details Form */}
      <div className="space-y-4 my-6">
        <div>
          <label className="block text-sm font-medium mb-1">Quantity *</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Date *</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => {
              const selectedDate = e.target.value
              if (bookedDates.includes(selectedDate)) {
                toast.error({
                  title: "Date unavailable",
                  description: "This date is already booked. Please select another date.",
                })
                return
              }
              setDeliveryDate(selectedDate)
            }}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={loadingDates}
          />
          {loadingDates && (
            <p className="text-xs text-gray-500 mt-1">Loading available dates...</p>
          )}
          {!loadingDates && bookedDates.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                ⚠️ Unavailable Dates:
              </p>
              <div className="flex flex-wrap gap-1">
                {bookedDates.slice(0, 10).map((date) => (
                  <span key={date} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    {new Date(date + 'T00:00:00').toLocaleDateString('de-DE', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })}
                  </span>
                ))}
                {bookedDates.length > 10 && (
                  <span className="text-xs text-gray-600">
                    +{bookedDates.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Installation Location *</label>
          <input
            type="text"
            value={installationLocation}
            onChange={(e) => setInstallationLocation(e.target.value)}
            placeholder="Enter installation address"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Container Exchange</label>
          <input
            type="text"
            value={containerExchange}
            onChange={(e) => setContainerExchange(e.target.value)}
            placeholder="Container exchange details (optional)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Local Contact Name *</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Enter contact person name"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Contact Telephone *</label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Enter contact phone number"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding || !variantStock || !variantHasPrice}
        loading={isAdding}
        className="w-full uppercase mb-4 py-3 flex justify-center"
        size="large"
      >
        {isAdding ? "ADDING..." : variantStock && variantHasPrice ? "ADD TO CART" : "OUT OF STOCK"}
      </Button>
      {/* Seller message */}

      {user && product.seller && (
        <Chat
          user={user}
          seller={product.seller}
          buttonClassNames="w-full uppercase"
          product={product}
        />
      )}
    </div>
  )
}
