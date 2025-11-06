"use client"

import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { WasteInfoModal } from "@/components/atoms"

interface ContainerSelectionProps {
  zoneId: string
  wasteTypeId: string
}

const wasteTypes = [
  { id: "abbruchholz-altholz-behandelt", name: "ABBRUCHHOLZ (ALTHOLZ BEHANDELT)" },
  { id: "baumischabfall-mit-mineralik", name: "BAUMISCHABFALL MIT MINERALIK (BAUSCHUTT)" },
  { id: "bauschutt", name: "BAUSCHUTT" },
  { id: "baumischabfall-ohne-mineralik", name: "BAUMISCHABFALL OHNE MINERALIK (BAUSCHUTT)" },
  { id: "bauschutt-leichtbaustoffe", name: "BAUSCHUTT / LEICHTBAUSTOFFE" },
  { id: "boden-bauschuttgemisch", name: "BODEN- / BAUSCHUTTGEMISCH" },
  { id: "bodenaushub", name: "BODENAUSHUB" },
  { id: "bodenaushub-biologische-rueckstaende", name: "BODENAUSHUB MIT BIOLOGISCHEN RÜCKSTÄNDEN" },
  { id: "garten-parkabfaelle", name: "GARTEN- UND PARKABFÄLLE (GRÜNSCHNITT)" },
  { id: "gips-gipskartonplatten", name: "GIPS / GIPSKARTONPLATTEN" },
  { id: "sperrmuell", name: "SPERRMÜLL" },
  { id: "polterabend-bauschutt", name: "POLTERABEND (BAUSCHUTT)" },
]

const containerOptions = [
  { id: "3-cbm-offen", name: "3 cbm Absetzcontainer, offen", price: "240,00 €", period: "2-Wochen-Pauschale", description: "Kleinster Container für kleine Projekte", image: "/images/container-3cbm.png" },
  { id: "5-5-cbm-offen", name: "5,5 cbm Absetzcontainer, offen", price: "295,00 €", period: "2-Wochen-Pauschale", description: "Ideal für Renovierungen", image: "/images/container-5-5cbm.png" },
  { id: "5-5-cbm-klappe", name: "5,5 cbm Klappe Absetzcontainer", price: "295,00 €", period: "2-Wochen-Pauschale", description: "Mit Klappe für einfacheres Beladen", image: "/images/container-5-5cbm-klappe.png" },
  { id: "7-cbm-offen", name: "7 cbm Absetzcontainer, offen", price: "330,00 €", period: "2-Wochen-Pauschale", description: "Für größere Bauprojekte", image: "/images/container-7cbm.png" },
  { id: "7-cbm-klappe", name: "7 cbm Klappe Absetzcontainer", price: "330,00 €", period: "2-Wochen-Pauschale", description: "Großer Container mit Klappe", image: "/images/container-7cbm-klappe.png" },
]

export const ContainerSelection = ({ zoneId, wasteTypeId }: ContainerSelectionProps) => {
  const router = useRouter()
  const params = useParams() as { locale?: string }
  const locale = params?.locale || ""
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    return zoneNames[id] || `Zone ${id} Container - KS Containerdienst`
  }

  const selectedWasteType = wasteTypes.find((w) => w.id === wasteTypeId)

  return (
    <div className="bg-white py-16 pt-4">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <span>{getZoneName(zoneId)}</span>
            <span className="mx-2">»</span>
            <span className="font-bold text-gray-900">{selectedWasteType?.name}</span>
          </nav>
        </div>

        {/* Info Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 transition-colors"
          >
            Was darf rein bei {selectedWasteType?.name}?
          </button>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Wählen Sie bitte die Containergröße:</h1>
        </div>

        {/* Container Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {containerOptions.map((container) => (
            <div
              key={container.id}
              onClick={() => router.push(`/${locale}/versandzonen/${zoneId}/${wasteTypeId}/${container.id}`)}
              className="bg-transparent cursor-pointer overflow-hidden"
            >
              {/* Top Section - Illustration */}
              <div className="bg-transparent p-4 border border-gray-300 mb-4 h-48 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center relative">
                  <Image src="/images/waste.png" alt={container.name} fill className="object-cover" />
                </div>
              </div>

              {/* Bottom Section - Text Details */}
              <div className="bg-transparent px-0 pb-0">
                <h3 className="font-bold text-gray-900 text-sm mb-2 leading-tight">{container.name}</h3>
                <div className=" text-gray-900 text-sm">
                  <span className="text-yellow-500 font-bold">{container.price}</span> / {container.period}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waste Info Modal */}
      <WasteInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} wasteType={wasteTypeId} />
    </div>
  )
}


