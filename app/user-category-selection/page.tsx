"use client"

import { useState, useRef, useEffect } from "react"
import { ShoppingBag, Pill, ArrowLeft } from "lucide-react"
import { selectUserCategory } from "./actions"
import { useSearchParams, useRouter } from "next/navigation"

export default function UserCategorySelection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  // Cleanup function to prevent state updates after unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleCategorySelect = async (category: string) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("userId", userId || "")
      formData.append("category", category)

      const result = await selectUserCategory(formData)

      // Check if component is still mounted before updating state
      if (!isMounted.current) return

      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      // Handle successful submission with client-side navigation
      if (result?.success && result?.redirectTo) {
        // Set a flag to prevent further state updates
        isMounted.current = false
        router.push(result.redirectTo)
      }
    } catch (err) {
      // Check if component is still mounted before updating state
      if (isMounted.current) {
        setError("An unexpected error occurred. Please try again.")
        setIsSubmitting(false)
      }
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-6xl w-full">
        <div className="flex items-center mb-8">
          <button
            onClick={handleGoBack}
            className="mr-4 flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-800">What would you like to purchase?</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 max-w-md mx-auto">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Groceries Card */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Groceries</h2>
            <p className="text-gray-600 mb-8">Browse discounted food items and grocery products near expiry</p>
            <button
              onClick={() => handleCategorySelect("groceries")}
              disabled={isSubmitting}
              className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Browse Groceries
            </button>
          </div>

          {/* Medicines Card */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Pill className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Medicines</h2>
            <p className="text-gray-600 mb-8">Find discounted over-the-counter and prescription medicines</p>
            <button
              onClick={() => handleCategorySelect("medicines")}
              disabled={isSubmitting}
              className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Browse Medicines
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

