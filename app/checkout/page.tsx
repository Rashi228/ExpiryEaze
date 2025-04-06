"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Checkout() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")
  const orderId = searchParams.get("orderId")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold text-center mb-2">Payment Error</h2>
            <p className="text-center">{error}</p>
          </div>
          <Link
            href="/cart"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
          <p className="text-gray-600 mb-6">Your order has been placed and is being processed.</p>
          <Link
            href="/user-dashboard"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/cart" className="flex items-center text-green-600 hover:text-green-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 ml-auto">Checkout</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between border-b pb-4 mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${(Number.parseFloat(amount || "0") - 4.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-4 mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">$4.99</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${Number.parseFloat(amount || "0").toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-green-600" />
              Payment Information
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800">
                Payment gateway integration has been removed. You can implement your preferred payment method later.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setLoading(true)

                // Simulate payment processing
                setTimeout(() => {
                  setLoading(false)
                  setPaymentSuccess(true)
                }, 1500)
              }}
            >
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                  <div className="border border-gray-300 rounded-md p-3 bg-gray-100">
                    <p className="text-gray-500 text-center">Payment gateway placeholder</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                  <div className="border border-gray-300 rounded-md p-3 bg-gray-100">
                    <p className="text-gray-500 text-center">Address form placeholder</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

