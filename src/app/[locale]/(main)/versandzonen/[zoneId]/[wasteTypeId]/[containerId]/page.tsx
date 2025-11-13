import { ProductDetail } from "@/components/sections/ProductDetail/ProductDetail"

interface ProductDetailPageProps {
  params: Promise<{
    zoneId: string
    wasteTypeId: string
    containerId: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { zoneId, wasteTypeId, containerId } = await params
  // TODO: Fetch product data based on zoneId, wasteTypeId, containerId
  // For now, return a placeholder
  return (
    <main>
      <div>Product Detail Page - Zone: {zoneId}, Waste Type: {wasteTypeId}, Container: {containerId}</div>
    </main>
  )
}


