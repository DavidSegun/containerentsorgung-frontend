import { ConfirmedForm } from "@/components/sections/ConfirmedForm/ConfirmedForm"
import { Metadata } from "next"

export const metadata = {
  title: "Bestätigung",
  description: "Bestätigung - Container Entsorgung Shop",
}

export default function ConfirmedPage() {
  return (
    <main>
      <ConfirmedForm />
    </main>
  )
}
