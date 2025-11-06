"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { sdk } from "@/lib/config"

interface ZoneProductsProps {
  zoneId: string
}

type Category = { handle: string; name: string }

export const ZoneProducts = ({ zoneId }: ZoneProductsProps) => {
  const [selectedWasteType, setSelectedWasteType] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams() as { locale?: string }
  const locale = params?.locale || ""

  useEffect(() => {
    const load = async () => {
      try {
        const { product_categories } = await sdk.client.fetch<any>(
          "/store/product-categories",
          {
            query: { limit: 1000, fields: "handle,name" },
            cache: "force-cache",
            next: { revalidate: 3600 },
          }
        )
        setCategories(
          (product_categories || []).map((c: any) => ({
            handle: Array.isArray(c.handle) ? c.handle.join("/") : c.handle,
            name: c.name,
          }))
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getZoneName = (id: string) => {
    const zoneNames: { [key: string]: string } = {
      "zone-1": "Zone 1 Container - KS Containerdienst",
      "zone-2": "Zone 2 Container - KS Containerdienst",
      "zone-3": "Zone 3 Container - KS Containerdienst",
      "zone-4": "Zone 4 Container - KS Containerdienst",
      "zone-5": "Zone 5 Container - KS Containerdienst",
      "zone-6": "Zone 6 Container - KS Containerdienst",
      "zone-7": "Zone 7 Container - KS Containerdienst",
      "zone-8": "Zone 8 Container - KS Containerdienst",
      "zone-9": "Zone 9 Container - KS Containerdienst",
    }
    return zoneNames[id] || "Container - KS Containerdienst"
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-sm font-semibold text-gray-900 mb-2">
            {getZoneName(zoneId)}
          </h1>
          <h2 className="text-base font-bold text-gray-700">
            Wählen Sie bitte die Abfallart:
          </h2>
        </div>

        {/* Categories Grid from backend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {(loading ? [] : categories).map((cat) => (
            <div
              key={cat.handle}
              onClick={() => router.push(`/${locale}/versandzonen/${zoneId}/${encodeURIComponent(cat.handle)}`)}
              className={`bg-white rounded-lg border border-gray-300 cursor-pointer transition-all overflow-hidden ${selectedWasteType === cat.handle ? "border-yellow-500" : "border-gray-300 hover:border-yellow-500"}`}
            >
              {/* Illustration Section (Top 70-75%) */}
              <div className="bg-white p-4 h-48 flex items-center justify-center">
                <div className="w-full  relative h-full flex items-center justify-center">
                  <Image src="/images/waste.png" alt={cat.name} fill className="object-cover" />
                </div>
              </div>
              {/* Text Label Section (Bottom 25-30%) */}
              <div className="bg-gray-200 px-4 py-3 h-20 flex items-center justify-center">
                <h3 className="text-sm font-bold text-gray-900 text-center leading-tight uppercase">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


