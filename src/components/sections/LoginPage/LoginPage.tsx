"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/data/customer"

export const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formDataObj = new FormData()
      formDataObj.append("email", formData.email)
      formDataObj.append("password", formData.password)

      const res = await login(formDataObj)
      if (res) {
        setError(res)
      } else {
        router.push("/user")
      }
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logov1.png"
              width={126}
              height={40}
              alt="Container Entsorgung Shop"
              className="mx-auto"
            />
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Anmelden
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Passwort
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded transition-colors disabled:opacity-50"
              >
                {loading ? "Anmelden..." : "Anmelden"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Noch kein Konto?{" "}
                <a href="/user/register" className="text-gray-800 hover:text-gray-900 font-medium">
                  Jetzt registrieren
                </a>
              </p>
            </div>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Passwort vergessen?
              </a>
            </div>
          </div>

          {/* Container Image */}
          <div className="text-center mt-8">
            <Image
              src="/images/7-cbm-special-type-covered-top-waste-skip-1.png"
              width={200}
              height={150}
              alt="Container"
              className="mx-auto opacity-20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
