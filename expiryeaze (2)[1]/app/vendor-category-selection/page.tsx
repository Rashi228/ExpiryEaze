"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag, Pill } from "lucide-react"

export default function VendorCategorySelection() {
  const router = useRouter()

  const handleCategorySelect = (category: string) => {
    if (category === "groceries") {
      router.push("/vendor-dashboard")
    } else {
      router.push("/medicine-vendor-verification")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">What would you like to sell?</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Groceries Card */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Groceries</h2>
            <p className="text-gray-600 mb-8">List food items and grocery products that are approaching expiry</p>
            <button
              onClick={() => handleCategorySelect("groceries")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Sell Groceries
            </button>
          </div>

          {/* Medicines Card */}
          <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Pill className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Medicines</h2>
            <p className="text-gray-600 mb-8">
              List over-the-counter and prescription medicines (requires verification)
            </p>
            <button
              onClick={() => handleCategorySelect("medicines")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Sell Medicines
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

