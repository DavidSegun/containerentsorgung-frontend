"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { addToCart } from "@/lib/data/cart"
import { getProductBookedDates } from "@/lib/data/availability"
import { toast } from "@/lib/helpers/toast"
import { DatePicker } from "@/components/molecules/DatePicker/DatePicker"
import "@/styles/datepicker.css"

interface ProductDetailProps {
  product: any
  cheapestPrice: any
  locale: string
}

export const ProductDetail = ({ product, cheapestPrice, locale }: ProductDetailProps) => {
  const router = useRouter()
  const params = useParams() as { locale?: string }
  const currentLocale = params?.locale || locale
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [activeTab, setActiveTab] = useState<'description' | 'dealer'>('description')
  const [quantity, setQuantity] = useState(1)
  const [locationType, setLocationType] = useState('')
  const [containerExchange, setContainerExchange] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [loadingDates, setLoadingDates] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

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

  // Get product image
  const productImage = product?.thumbnail || product?.images?.[0]?.url || "/images/placeholder.svg"

  const isFormComplete = selectedDate && locationType && contactName && contactPhone

  const handleAddToCart = async () => {
    // Validate required fields
    if (!selectedDate || !locationType || !contactName || !contactPhone) {
      toast.error({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
      })
      return
    }

    // Format date to YYYY-MM-DD for backend (without timezone conversion)
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`


    setIsAdding(true)

    try {
      // Get the first variant ID from the product
      const variantId = product.variants?.[0]?.id

      if (!variantId) {
        toast.error({
          title: "Fehler",
          description: "Keine Produktvariante gefunden",
        })
        setIsAdding(false)
        return
      }

      // Add to cart with metadata
      await addToCart({
        variantId,
        quantity,
        countryCode: currentLocale,
        metadata: {
          'delivery_date': formattedDate,  // Changed from selectedDate
          'installation_location': locationType,
          'container_exchange': containerExchange,
          'contact_name': contactName,
          'contact_phone': contactPhone,
        },
      })

      toast.success({
        title: "Zum Warenkorb hinzugefügt",
        description: "Produkt wurde erfolgreich hinzugefügt",
      })
      setSelectedDate(null)  // Changed from setSelectedDate
      // Navigate to cart page
      setTimeout(() => {
        router.push(`/${currentLocale}/cart`)
      }, 500)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error({
        title: "Fehler",
        description: "Fehler beim Hinzufügen zum Warenkorb",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Image */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
              <div className="relative">
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center relative">
                  <Image
                    src={productImage}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                  {/* Zoom icon */}
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="absolute bottom-4 left-4 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Section - Moved under image */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-2 px-1 border-b-2 font-bold text-sm ${activeTab === 'description'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    BESCHREIBUNG
                  </button>
                  <button
                    onClick={() => setActiveTab('dealer')}
                    className={`py-2 px-1 border-b-2 font-bold text-sm ${activeTab === 'dealer'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    HÄNDLER
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'description' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      {product.title}
                    </h2>

                    {product.description && (
                      <div className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-2">Beschreibung:</h3>
                        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                      </div>
                    )}

                    {product.subtitle && (
                      <div className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-2">Untertitel:</h3>
                        <p className="text-gray-700">{product.subtitle}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'dealer' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Händler</h3>
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 mr-4">
                            <Image
                              src={product.seller?.logo || "/logov1.png"}
                              alt={product.seller?.name || "Dealer Logo"}
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">{product.seller?.name || "Unknown Seller"}</h4>
                            <p className="text-base text-gray-600">{product.seller?.store_name || "ONLINE STORE"}</p>
                          </div>
                        </div>
                        <div className="text-base text-gray-700">
                          <p>{product.seller?.name || "Unknown Seller"}</p>
                          <p>{product.seller?.store_name || "Online Store"}</p>
                          <p>{product.seller?.email || "No email provided"}</p>
                        </div>
                      </div>

                      <div>
                        <div className="text-base text-gray-700">
                          <p className="mb-2">{product.seller?.store_name || "Online Store"}</p>
                          <p className="mb-4">Email: {product.seller?.email || "support@mercur.com"}</p>

                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Geschäftszeiten</h4>
                            <p>Mo-Fr: 9.00-18.00 Uhr</p>
                            <p>Sa-So: Geschlossen</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Rechtliches:</h4>
                            <div className="space-y-1">
                              <a href="#" className="block text-base text-gray-600 underline hover:text-gray-800">Impressum</a>
                              <a href="#" className="block text-base text-gray-600 underline hover:text-gray-800">Datenschutz</a>
                              <a href="#" className="block text-base text-gray-600 underline hover:text-gray-800">Widerrufsbelehrung</a>
                              <a href="#" className="block text-base text-gray-600 underline hover:text-gray-800">AGB</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-1">
            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="text-sm text-gray-600">
                <span>{product.seller?.name || "Mercur Marketplace"}</span>
                <span className="mx-2">»</span>
                <span>Products</span>
                <span className="mx-2">»</span>
                <span className="font-bold text-gray-900">{product.title}</span>
              </nav>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-bold text-gray-500 mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="text-2xl font-bold text-gray-900 mb-6">
              <span className="text-yellow-500">{cheapestPrice?.calculated_price}</span>
              {cheapestPrice?.calculated_price !== cheapestPrice?.original_price && (
                <span className="text-gray-500 line-through ml-2 text-sm">
                  {cheapestPrice?.original_price}
                </span>
              )}
            </div>

            {/* Order Form */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wählen Sie die Anzahl und den Wunschtermin für die Lieferung aus. *
              </h3>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Anzahl:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                />
              </div>

              {/* Calendar */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Liefertermin: *
                </label>
                <DatePicker
                  selectedDate={selectedDate}
                  onChange={setSelectedDate}
                  bookedDates={bookedDates}
                  loading={loadingDates}
                  minDate={new Date(Date.now() + 86400000)}
                  className="w-full"
                />
              </div>

              {/* Installation Location */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aufstellungsort *
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Wählen Sie bitte hier, ob es sich bei dem Stellplatz um ein privates oder ein öffentliches Grundstück handelt. <strong>WICHTIG</strong>: Wenn Sie die Aufstellung auf öffentlichem Grund vorsehen, benötigen Sie eine Genehmigung der zuständigen Kommune.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="private"
                      checked={locationType === 'private'}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm font-bold">Privater Grund</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="public-with-permit"
                      checked={locationType === 'public-with-permit'}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm font-bold">Öffentlicher Grund & Genehmigung liegt vor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="locationType"
                      value="public-needs-permit"
                      checked={locationType === 'public-needs-permit'}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm font-bold">Öffentlicher Grund & Genehmigung wird benötigt</span>
                  </label>
                </div>
              </div>

              {/* Container Exchange */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Containertausch?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ein Container steht bereits am Aufstellungsort. Bitte nehmen Sie diesen bei der Anlieferung des neuen Containers mit. <strong>WICHTIG</strong>: Wenn mehr als ein Container dort steht, dann teilen Sie uns bitte im Freitextfeld &ldquo;Bestellhinweise&rdquo; auf der Kassenseite mit, welcher Container mitgenommen werden soll.
                </p>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={containerExchange}
                    onChange={(e) => setContainerExchange(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-bold">Ja, der Container soll ausgetauscht werden</span>
                </label>
              </div>
            </div>

            {/* Contact Person */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Name des Ansprechpartners vor Ort *
              </h3>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Name eingeben"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tel. des Ansprechpartners vor Ort *
              </h3>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Telefonnummer eingeben"
              />
            </div>

            {/* Delivery Note */}
            <p className="text-red-600 text-sm mt-4">
              Hinweis: Bestellungen nach 18:00 Uhr können möglicherweise nicht am nächsten Tag geliefert werden, da die Disposition erst am folgenden Werktag erfolgt.
            </p>

            {/* Order Summary */}
            {isFormComplete && (
              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Bestellübersicht</h3>

                {/* Product Item */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{product.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{cheapestPrice?.calculated_price}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">
                      Aufstellungsort - {locationType === 'private' ? 'Privater Grund' :
                        locationType === 'public-with-permit' ? 'Öffentlicher Grund & Genehmigung liegt vor' :
                          'Öffentlicher Grund & Genehmigung wird benötigt'}
                    </span>
                    <span className="text-gray-500">-</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Name des Ansprechpartners vor Ort - {contactName}</span>
                    <span className="text-gray-500">-</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Tel. des Ansprechpartners vor Ort - {contactPhone}</span>
                    <span className="text-gray-500">-</span>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Zwischensumme</span>
                    <span className="text-lg font-bold text-gray-900">{cheapestPrice?.calculated_price}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 transition-colors mt-6 flex items-center justify-center"
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Wird hinzugefügt...
                    </>
                  ) : (
                    'In den Warenkorb'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-full w-full bg-white p-4 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Image */}
            <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
              <Image
                src={productImage}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Caption */}
            <div className="p-4 bg-white border-t">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.title}
              </h3>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}