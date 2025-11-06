"use client"

import { useEffect } from "react"

interface WasteInfoModalProps {
  isOpen: boolean
  onClose: () => void
  wasteType: string
}

const wasteTypeInfo = {
  bauschutt: {
    title: "recyclingfähiger Bauschutt",
    allowed: ["Beton", "Ziegel", "Fliesen", "Estrich", "Waschbecken", "Keramik", "Toiletten", "Mauerwerk", "Dachziegel"],
    notAllowed: [
      "Holzreste, Holzsplitter, Sägespäne",
      "Gipsstein, Gipskarton, Gipsputz",
      "Tapeten",
      "Metalle, z. B. Moniereisen, Streckmetall, Heizkörper oder Kabel",
      "flüssige Abfälle",
      "Farbeimer und Lackdosen",
      "Gartenabfälle",
      "Sondermüll",
    ],
  },
  "baumischabfall-mit-mineralik": {
    title: "Baumischabfall mit Mineralik",
    allowed: ["Beton", "Ziegel", "Fliesen", "Estrich", "Waschbecken", "Keramik", "Toiletten", "Mauerwerk", "Dachziegel", "Holzreste (unbehandelt)"],
    notAllowed: [
      "Gipsstein, Gipskarton, Gipsputz",
      "Tapeten",
      "Metalle",
      "flüssige Abfälle",
      "Farbeimer und Lackdosen",
      "Gartenabfälle",
      "Sondermüll",
    ],
  },
}

export const WasteInfoModal = ({ isOpen, onClose, wasteType }: WasteInfoModalProps) => {
  const info = (wasteTypeInfo as any)[wasteType] || (wasteTypeInfo as any).bauschutt

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 text-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{info.title}</h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto"></div>
        </div>
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-yellow-500 mb-6">Was darf rein?</h3>
              <ul className="text-left space-y-2">
                {info.allowed.map((item: string, index: number) => (
                  <li key={index} className="text-gray-900 flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-6">Das darf NICHT rein!</h3>
              <ul className="text-left space-y-2">
                {info.notAllowed.map((item: string, index: number) => (
                  <li key={index} className="text-gray-900 flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="px-8 py-4 border-t border-gray-200 text-center">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 rounded-none text-white font-semibold py-2 px-6  transition-colors">Schließen</button>
        </div>
      </div>
    </div>
  )
}


