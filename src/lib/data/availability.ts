"use server"

import { sdk } from "../config"

export const getProductBookedDates = async (productId: string): Promise<string[]> => {
  try {
    const response = await sdk.client.fetch<{
      booked_dates: string[]
      date_bookings?: Record<string, number>
    }>(`/store/products/${productId}/available-dates`, {
      method: "GET",
      cache: "no-cache",
    })

    return response.booked_dates || []
  } catch (error) {
    console.error("Error fetching booked dates:", error)
    return []
  }
}
