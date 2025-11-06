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
  return (
    <main>
      <ProductDetail zoneId={zoneId} wasteTypeId={wasteTypeId} containerId={containerId} />
    </main>
  )
}


