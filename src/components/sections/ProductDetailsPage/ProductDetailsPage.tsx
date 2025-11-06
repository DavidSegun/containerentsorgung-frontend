import { ProductDetail } from "../ProductDetail/ProductDetail"
import { listProducts } from "@/lib/data/products"
import { getProductPrice } from "@/lib/helpers/get-product-price"
import NotFound from "@/app/not-found"

export const ProductDetailsPage = async ({
  handle,
  locale,
}: {
  handle: string
  locale: string
}) => {
  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!prod) return null

  if (prod.seller?.store_status === "SUSPENDED") {
    return NotFound()
  }

  const { cheapestPrice } = getProductPrice({
    product: prod,
  })

  return <ProductDetail product={prod} cheapestPrice={cheapestPrice} locale={locale} />
}
