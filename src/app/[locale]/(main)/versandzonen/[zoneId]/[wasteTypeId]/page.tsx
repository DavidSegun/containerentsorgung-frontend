import { ProductListing } from "@/components/sections/ProductListing/ProductListing"
import { getCategoryByHandle, listCategories } from "@/lib/data/categories"

interface ContainerSelectionPageProps {
  params: Promise<{
    locale: string
    zoneId: string
    wasteTypeId: string
  }>
}

export default async function ContainerSelectionPage({ params }: ContainerSelectionPageProps) {
  const { locale, zoneId, wasteTypeId } = await params

  // Resolve category by handle to get ID (exact)
  let category = await getCategoryByHandle([wasteTypeId])

  // Fallback: fetch all categories and try to match by name or normalized handle
  if (!category) {
    try {
      const { categories } = await listCategories({ query: { limit: 1000, fields: "handle,name,id" } })
      const normalized = decodeURIComponent(wasteTypeId).toLowerCase()
      category = (categories as any[]).find((c: any) => {
        const h = Array.isArray(c.handle) ? c.handle.join("/") : c.handle
        return (
          (h && String(h).toLowerCase() === normalized) ||
          (c.name && String(c.name).toLowerCase() === normalized)
        )
      })
    } catch {}
  }

  const categoryId = (category as any)?.id as string | undefined

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <ProductListing category_id={categoryId} locale={locale} zoneId={zoneId} />
      </div>
    </main>
  )
}


