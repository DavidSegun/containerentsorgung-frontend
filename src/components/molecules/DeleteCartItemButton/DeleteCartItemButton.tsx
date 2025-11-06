"use client"

import { Button } from "@/components/atoms"
import { BinIcon } from "@/icons"
import { deleteLineItem } from "@/lib/data/cart"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/helpers/toast"

export const DeleteCartItemButton = ({ id }: { id: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteLineItem(id)
      toast.success({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
      router.refresh()
    } catch (error) {
      toast.error({
        title: "Error removing item",
        description: "Failed to remove item from cart",
      })
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <Button
      variant="text"
      className="w-10 h-10 flex items-center justify-center p-0"
      onClick={() => handleDelete(id)}
      loading={isDeleting}
      disabled={isDeleting}
    >
      <BinIcon size={20} />
    </Button>
  )
}
