import { ZoneProducts } from "@/components/sections/ZoneProducts/ZoneProducts"

interface ZonePageProps {
  params: Promise<{
    zoneId: string
  }>
}

export default async function ZonePage({ params }: ZonePageProps) {
  const { zoneId } = await params
  return (
    <main>
      <ZoneProducts zoneId={zoneId} />
    </main>
  )
}


