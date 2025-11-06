"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ResetPasswordPageProps {
  token?: string
}

export const ResetPasswordPage = ({ token }: ResetPasswordPageProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
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

    if (formData.password !== formData.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.")
      setLoading(false)
      return
    }

    try {
      // Here you would typically call an API to reset the password
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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

            {/* Success Message */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Passwort erfolgreich geändert
              </h1>
              <p className="text-gray-600 mb-6">
                Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
              </p>
              <button
                onClick={() => router.push("/user")}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded transition-colors"
              >
                Zur Anmeldung
              </button>
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

          {/* Reset Password Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Neues Passwort setzen
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mindestens 8 Zeichen, Groß- und Kleinbuchstaben, Zahlen oder Sonderzeichen
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent rounded"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded transition-colors disabled:opacity-50"
              >
                {loading ? "Passwort ändern..." : "Passwort ändern"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/user" className="text-sm text-gray-600 hover:text-gray-800">
                Zurück zur Anmeldung
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
