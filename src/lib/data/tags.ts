"use server"

import { sdk } from "../config"

export interface ProductTag {
  id: string
  value: string
  created_at: string
  updated_at: string
}

/**
 * Get all product tags
 */
export async function getProductTags(): Promise<ProductTag[]> {
  try {
    const response = await sdk.client.fetch<{ product_tags: ProductTag[] }>(
      `/store/product-tags`,
      {
        method: "GET",
        cache: "no-cache",
      }
    )

    return response.product_tags || []
  } catch (error) {
    console.error("Error fetching product tags:", error)
    return []
  }
}

/**
 * Get tag ID by tag value (name)
 */
export async function getTagIdByName(tagName: string): Promise<string | null> {
  try {
    const tags = await getProductTags()
    const tag = tags.find(t => t.value.toLowerCase() === tagName.toLowerCase())
    return tag ? tag.id : null
  } catch (error) {
    console.error("Error getting tag by name:", error)
    return null
  }
}

/**
 * Get zone tag ID from postal code
 */
export async function getZoneTagIdFromPostalCode(postalCode: string): Promise<string | null> {
  const { getTagNameFromPostalCode } = await import("../helpers/postal-code-zones")
  const tagName = getTagNameFromPostalCode(postalCode)
  
  if (!tagName) {
    return null
  }

  return await getTagIdByName(tagName)
}
