"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag, Pill } from "lucide-react"

export default function UserCategorySelection() {
  const router = useRouter()

  const handleCategorySelect = (category: string) => {
    if (category === "groceries") {
      router.push("/user-dashboard")
    } else {
      router.push("/medicines-dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">What would you like to purchase?</h1>

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
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
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
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Browse Medicines
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

