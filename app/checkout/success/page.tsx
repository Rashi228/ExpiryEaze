"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ShoppingBag } from "lucide-react"

export default function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState({
    orderId:
      "ORD" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0"),
    date: new Date().toLocaleDateString(),
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the order details from your database
    // based on the payment_intent parameter
    const paymentIntent = searchParams.get("payment_intent")

    if (paymentIntent) {
      // Simulate fetching order details
      setTimeout(() => {
        setOrderDetails({
          ...orderDetails,
          total: Math.floor(Math.random() * 100) + 20, // Random total between $20 and $120
        })
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }, [searchParams, orderDetails])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{orderDetails.date}</span>
              </div>
              <div className="flex justify-between border-t pt-3 mt-3">
                <span className="text-gray-600 font-semibold">Total:</span>
                <span className="font-bold">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8">We've sent a confirmation email with all the details of your order.</p>

          <Link
            href="/user-dashboard"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

