"use client"

import { Button } from "@/components/atoms"
import { BinIcon } from "@/icons"
import { removeShippingMethod } from "@/lib/data/cart"
import { convertToLocale } from "@/lib/helpers/money"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export const CartShippingMethodRow = ({
  method,
  currency_code,
}: {
  method: HttpTypes.StoreCartShippingMethod
  currency_code: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const stepParam = searchParams.get("step")
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemoveShippingMethod = async () => {
    setIsRemoving(true)
    await removeShippingMethod(method.id)
      .then(() => {
        const nextStep = stepParam === "y" ? "delivery" : "y"
        router.replace(pathname + `?step=${nextStep}`, { scroll: false })
        router.refresh()
      })
      .finally(() => setIsRemoving(false))
  }

  return (
    <div className="mb-4 border rounded-md p-4 flex items-center justify-between">
      <div>
        <Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
        <Text className="txt-medium text-ui-fg-subtle">
          {method?.name}{" "}
          {convertToLocale({
            amount: method?.amount!,
            currency_code: currency_code,
          })}
        </Text>
      </div>

      <Button
        variant="tonal"
        size="small"
        className="p-2"
        onClick={handleRemoveShippingMethod}
        loading={isRemoving}
      >
        <BinIcon size={16} />
      </Button>
    </div>
  )
}
