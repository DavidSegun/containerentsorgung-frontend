import { CheckoutForm } from "@/components/sections/CheckoutForm/CheckoutForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kasse",
  description: "Kasse - Container Entsorgung Shop",
}

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutForm />
    </main>
  )
}
