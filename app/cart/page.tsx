"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { createCheckoutSession } from "./actions"
import { useSearchParams, useRouter } from "next/navigation"

// Mock product data for lookup
const PRODUCTS = [
  {
    id: 1,
    name: "Organic Apples",
    vendor: "Green Grocers",
    price: 2.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Whole Grain Bread",
    vendor: "Healthy Bakery",
    price: 2.25,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Greek Yogurt",
    vendor: "Dairy Delights",
    price: 1.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Vitamin C Supplements",
    vendor: "Health Essentials",
    price: 7.79,
    image: "/placeholder.svg?height=80&width=80",
  },
]

// Mock medicine data for lookup
const MEDICINES = [
  {
    id: 1,
    name: "Vitamin C Supplements",
    vendor: "Health Essentials",
    price: 7.79,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Allergy Relief Tablets",
    vendor: "MediCare Pharmacy",
    price: 5.39,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Pain Relief Gel",
    vendor: "Wellness Pharmacy",
    price: 9.59,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Antibiotics - Amoxicillin",
    vendor: "MediCare Pharmacy",
    price: 14.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Blood Pressure Medication",
    vendor: "Health Essentials",
    price: 19.79,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function Cart() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId") || "user123" // Fallback for demo
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  // Cleanup function to prevent state updates after unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      // Get cart IDs from localStorage
      const groceryCartIds = JSON.parse(localStorage.getItem("groceryCart") || "[]")
      const medicineCartIds = JSON.parse(localStorage.getItem("medicineCart") || "[]")

      // Convert IDs to cart items with product details
      const groceryItems = groceryCartIds
        .map((id: number) => {
          const product = PRODUCTS.find((p) => p.id === id)
          return product ? { ...product, quantity: 1 } : null
        })
        .filter(Boolean)

      const medicineItems = medicineCartIds
        .map((id: number) => {
          const medicine = MEDICINES.find((m) => m.id === id)
          return medicine ? { ...medicine, quantity: 1 } : null
        })
        .filter(Boolean)

      // Combine both types of items
      setCartItems([...groceryItems, ...medicineItems])
    }

    loadCartItems()
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    // Remove from state
    setCartItems(cartItems.filter((item) => item.id !== id))

    // Remove from localStorage
    const groceryCartIds = JSON.parse(localStorage.getItem("groceryCart") || "[]")
    const medicineCartIds = JSON.parse(localStorage.getItem("medicineCart") || "[]")

    if (groceryCartIds.includes(id)) {
      localStorage.setItem("groceryCart", JSON.stringify(groceryCartIds.filter((cartId: number) => cartId !== id)))
    }

    if (medicineCartIds.includes(id)) {
      localStorage.setItem("medicineCart", JSON.stringify(medicineCartIds.filter((cartId: number) => cartId !== id)))
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 4.99
  const total = subtotal + shipping

  const handleCheckout = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("userId", userId)
      formData.append("cartItems", JSON.stringify(cartItems))
      formData.append("totalAmount", total.toString())

      interface CheckoutResult {
        success?: boolean
        redirectTo?: string
        error?: string
      }
      

      const result = await createCheckoutSession(formData) as CheckoutResult

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button onClick={handleGoBack} className="flex items-center text-green-600 hover:text-green-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Continue Shopping</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 ml-auto">Your Cart</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md mr-4"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Vendor: {item.vendor}</p>
                        <p className="text-green-600 font-semibold">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="mx-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="ml-6 text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 mt-1 flex items-center text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link
            href="/user-dashboard"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md inline-block transition duration-300"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  )
}

