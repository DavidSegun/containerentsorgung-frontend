"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logov1.png"
                width={80}
                height={54}
                alt="Container Entsorgung Shop Logo"
                className="mr-1 aspect-video"
              />
              <div>
                <h3 className="font-extrabold text-yellow-500">container</h3>
                <p className="font-extrabold text-yellow-500">entsorgung.<span className="text-white">shop</span></p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 lg:col-span-2 gap-4 text-sm">
            <Link href="/container-bestellen" className="text-gray-300 hover:text-white transition-colors">
              Container
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-end space-x-3">
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 relative bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
            >
              <Image
                src="/icons/Youtube.svg"
                fill
                alt="YouTube"
              />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 relative bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
            >
              <Image
                src="/icons/Facebook.svg"
                fill
                alt="Facebook"
              />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 relative bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
            >
              <Image
                src="/icons/Linkedin.svg"
                fill
                alt="LinkedIn"
              />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 relative bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors"
            >
              <Image
                src="/icons/Instagram.svg"
                fill
                alt="Instagram"
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-white text-sm">
            © {new Date().getFullYear()} <span className="font-extrabold">containerentsorgung.shop</span> - Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}
