import {
  ProductListingActiveFilters,
  ProductListingHeader,
  ProductSidebar,
  ProductsList,
  ProductsPagination,
} from "@/components/organisms"
import { PRODUCT_LIMIT } from "@/const"
import { listProductsWithSort } from "@/lib/data/products"

export const ProductListing = async ({
  category_id,
  collection_id,
  seller_id,
  showSidebar = false,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION || "pl",
  zoneId,
}: {
  category_id?: string
  collection_id?: string
  seller_id?: string
  showSidebar?: boolean
  locale?: string
  zoneId?: string
}) => {
  // Get tag ID from zone if provided
  let tag_id: string | undefined
  if (zoneId) {
    const { getTagIdByName } = await import("@/lib/data/tags")
    tag_id = await getTagIdByName(zoneId) || undefined
  }

  const { response } = await listProductsWithSort({
    seller_id,
    category_id,
    collection_id,
    tag_id,
    countryCode: locale,
    sortBy: "created_at",
    queryParams: {
      limit: PRODUCT_LIMIT,
    },
  })

  const { products } = await response

  const count = products.length

  const pages = Math.ceil(count / PRODUCT_LIMIT) || 1

  // Show "no service" message if filtering by zone and no products found
  if (count === 0 && zoneId) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Kein Service in dieser Region verfügbar
            </h2>
            <p className="text-gray-700 mb-6">
              Leider bieten wir derzeit keine Containerservices in Ihrer Region an. 
              Bitte versuchen Sie es mit einer anderen Postleitzahl.
            </p>
            <a
              href={`/${locale}/container-bestellen`}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded transition-colors"
            >
              Zurück zur PLZ-Eingabe
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Show general "no products" message if no zone filtering
  if (count === 0) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Keine Produkte gefunden
            </h2>
            <p className="text-gray-700 mb-6">
              Derzeit sind keine Produkte in dieser Kategorie verfügbar. 
              Bitte schauen Sie später noch einmal vorbei oder erkunden Sie andere Kategorien.
            </p>
            <a
              href={`/${locale}/container-bestellen`}
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded transition-colors"
            >
              Zurück zur Startseite
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <ProductListingHeader total={count} />
      <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-4">
        {showSidebar && <ProductSidebar />}
        <section className={showSidebar ? "col-span-3" : "col-span-4"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <ProductsList products={products} />
          </div>
          <ProductsPagination pages={pages} />
        </section>
      </div>
    </div>
  )
}
