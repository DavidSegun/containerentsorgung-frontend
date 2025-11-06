import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"
import { BaseHit, Hit } from "instantsearch.js"

export const getPricesForVariant = (variant: any) => {
  // If calculated_price is available, use it
  if (variant?.calculated_price?.calculated_amount_with_tax || variant?.calculated_price?.calculated_amount) {
    if (!variant?.calculated_price?.calculated_amount_with_tax) {
      return {
        calculated_price_number: variant.calculated_price.calculated_amount,
        calculated_price: convertToLocale({
          amount: variant.calculated_price.calculated_amount,
          currency_code: variant.calculated_price.currency_code,
        }),
        original_price_number: variant.calculated_price.original_amount,
        original_price: convertToLocale({
          amount: variant.calculated_price.original_amount,
          currency_code: variant.calculated_price.currency_code,
        }),
        currency_code: variant.calculated_price.currency_code,
        price_type: variant.calculated_price.calculated_price.price_list_type,
        percentage_diff: getPercentageDiff(
          variant.calculated_price.original_amount,
          variant.calculated_price.calculated_amount
        ),
      }
    }

    return {
      calculated_price_number:
        variant.calculated_price.calculated_amount_with_tax,
      calculated_price: convertToLocale({
        amount: variant.calculated_price.calculated_amount_with_tax,
        currency_code: variant.calculated_price.currency_code,
      }),
      original_price_number: variant.calculated_price.original_amount_with_tax,
      original_price: convertToLocale({
        amount: variant.calculated_price.original_amount_with_tax,
        currency_code: variant.calculated_price.currency_code,
      }),
      currency_code: variant.calculated_price.currency_code,
      price_type: variant.calculated_price.calculated_price.price_list_type,
      percentage_diff: getPercentageDiff(
        variant.calculated_price.original_amount,
        variant.calculated_price.calculated_amount
      ),
    }
  }

  // Fallback to regular price data if calculated_price is not available
  if (variant?.prices && variant.prices.length > 0) {
    const price = variant.prices[0]
    return {
      calculated_price_number: price.amount,
      calculated_price: convertToLocale({
        amount: price.amount,
        currency_code: price.currency_code,
      }),
      original_price_number: price.amount,
      original_price: convertToLocale({
        amount: price.amount,
        currency_code: price.currency_code,
      }),
      currency_code: price.currency_code,
      price_type: null,
      percentage_diff: 0,
    }
  }

  return null
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: Hit<HttpTypes.StoreProduct> | Partial<Hit<BaseHit>>
  variantId?: string
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestVariant = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    return product.variants
      .filter((v: any) => !!v.calculated_price || (v.prices && v.prices.length > 0))
      .sort((a: any, b: any) => {
        // Use calculated_price if available
        if (a.calculated_price?.calculated_amount_with_tax && b.calculated_price?.calculated_amount_with_tax) {
          return a.calculated_price.calculated_amount_with_tax - b.calculated_price.calculated_amount_with_tax
        }
        if (a.calculated_price?.calculated_amount && b.calculated_price?.calculated_amount) {
          return a.calculated_price.calculated_amount - b.calculated_price.calculated_amount
        }
        // Fallback to regular prices
        if (a.prices?.[0]?.amount && b.prices?.[0]?.amount) {
          return a.prices[0].amount - b.prices[0].amount
        }
        return 0
      })[0]
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const variant: any = cheapestVariant()

    return getPricesForVariant(variant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v: any) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
    cheapestVariant: cheapestVariant(),
  }
}
