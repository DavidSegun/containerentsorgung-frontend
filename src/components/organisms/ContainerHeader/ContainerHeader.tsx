"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/atoms"
import { CartDropdown } from "@/components/cells/CartDropdown/CartDropdown"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"

export const ContainerHeader = () => {
  const params = useParams() as { locale?: string }
  const locale = params?.locale || ""
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [user, setUser] = useState<HttpTypes.StoreCustomer | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartData, userData] = await Promise.all([
          retrieveCart().catch(() => null),
          retrieveCustomer().catch(() => null)
        ])
        setCart(cartData)
        setUser(userData)
      } catch (error) {
        console.error('Error loading header data:', error)
      }
    }
    loadData()
  }, [])
  return (
    <>
      {/* Top Orange Banner */}
      <div className="bg-yellow-500 text-black text-sm py-2 px-4 text-center">
        <span className="font-medium flex justify-between w-full">
          <div>100 % Pauschalpreise</div>  
          <div>Sicher zahlen mit PayPal & Kreditkarte</div> 
          <div>Was darf rein bei Bauschutt Recyclingfähig</div>
        </span>
      </div>
      
      {/* Main Header */}
      <header className="bg-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between ">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center hover:opacity-90 transition-opacity">
              <Image
                src="/logov1.png"
                width={100}
                height={68}
                alt="Lurentus Container Shop"
                className="mr-1 aspect-video"
              />
              <div>
                <h1 className=" font-extrabold text-yellow-500">container</h1>
                <p className="font-extrabold text-yellow-500">entsorgung.<span className="text-white">shop</span></p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href={`/${locale}/container-bestellen`} className="text-white hover:text-yellow-500 transition-colors">
                Container
              </Link>
              <Link href={`/${locale}/faq`} className="text-white hover:text-yellow-500 transition-colors">
                FAQ
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4 text-white">
              <UserDropdown user={user} />
              <CartDropdown cart={cart} />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}


