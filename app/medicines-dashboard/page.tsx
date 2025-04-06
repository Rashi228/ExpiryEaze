"use client"

import React from "react"

import { useState } from "react"
import { Star, ShoppingCart, Heart, FileText, AlertCircle, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Mock medicine data
const MEDICINES = [
  {
    id: 1,
    name: "Vitamin C Supplements",
    vendor: "Health Essentials",
    originalPrice: 12.99,
    discountedPrice: 7.79,
    discount: "40%",
    expiryDate: "2025-06-15",
    quantity: 15,
    image: "/placeholder.svg?height=200&width=200",
    description: "High-quality Vitamin C supplements to boost your immune system.",
    requiresPrescription: false,
    category: "Vitamins & Supplements",
    reviews: [
      { id: 1, user: "Robert J.", rating: 5, comment: "Noticed a difference in my energy levels!" },
      { id: 2, user: "Patricia L.", rating: 4, comment: "Easy to swallow and no aftertaste." },
    ],
  },
  {
    id: 2,
    name: "Allergy Relief Tablets",
    vendor: "MediCare Pharmacy",
    originalPrice: 8.99,
    discountedPrice: 5.39,
    discount: "40%",
    expiryDate: "2025-05-20",
    quantity: 8,
    image: "/placeholder.svg?height=200&width=200",
    description: "Fast-acting allergy relief tablets for seasonal allergies.",
    requiresPrescription: false,
    category: "Allergy & Sinus",
    reviews: [
      { id: 1, user: "Jennifer K.", rating: 5, comment: "Works quickly and effectively!" },
      { id: 2, user: "Thomas B.", rating: 4, comment: "Great relief without drowsiness." },
    ],
  },
  {
    id: 3,
    name: "Pain Relief Gel",
    vendor: "Wellness Pharmacy",
    originalPrice: 15.99,
    discountedPrice: 9.59,
    discount: "40%",
    expiryDate: "2025-04-10",
    quantity: 12,
    image: "/placeholder.svg?height=200&width=200",
    description: "Topical gel for muscle and joint pain relief.",
    requiresPrescription: false,
    category: "Pain Relief",
    reviews: [
      { id: 1, user: "Michael R.", rating: 5, comment: "Works wonders for my back pain!" },
      { id: 2, user: "Susan T.", rating: 4, comment: "Fast-acting and no strong smell." },
    ],
  },
  {
    id: 4,
    name: "Antibiotics - Amoxicillin",
    vendor: "MediCare Pharmacy",
    originalPrice: 24.99,
    discountedPrice: 14.99,
    discount: "40%",
    expiryDate: "2025-05-30",
    quantity: 5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Prescription antibiotic for bacterial infections. Requires valid prescription.",
    requiresPrescription: true,
    category: "Antibiotics",
    reviews: [],
  },
  {
    id: 5,
    name: "Blood Pressure Medication",
    vendor: "Health Essentials",
    originalPrice: 32.99,
    discountedPrice: 19.79,
    discount: "40%",
    expiryDate: "2025-07-15",
    quantity: 10,
    image: "/placeholder.svg?height=200&width=200",
    description: "Prescription medication for managing high blood pressure. Requires valid prescription.",
    requiresPrescription: true,
    category: "Blood Pressure",
    reviews: [],
  },
]

export default function MedicinesDashboard() {
  const router = useRouter()
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null)
  const [prescription, setPrescription] = useState<File | null>(null)
  const [prescriptionPreview, setPrescriptionPreview] = useState("")

  const addToCart = (productId: number) => {
    const medicine = MEDICINES.find((m) => m.id === productId)

    if (medicine && medicine.requiresPrescription) {
      setSelectedMedicine(productId)
      setShowPrescriptionModal(true)
    } else {
      // Check if the product is already in the cart
      if (!cart.includes(productId)) {
        const newCart = [...cart, productId]
        setCart(newCart)
        // Store in localStorage to persist between pages
        localStorage.setItem("medicineCart", JSON.stringify(newCart))
        alert(`Medicine added to cart!`)
      } else {
        // If already in cart, increase quantity (in a real app)
        alert(`Medicine already in cart!`)
      }
    }
  }

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  const toggleProductDetails = (productId: number) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null)
    } else {
      setExpandedProduct(productId)
    }
  }

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPrescription(file)
      setPrescriptionPreview(URL.createObjectURL(file))
    }
  }

  const handlePrescriptionSubmit = () => {
    if (selectedMedicine && prescription) {
      // In a real app, you would upload the prescription to a server
      // and verify it before adding the medicine to the cart
      console.log(`Prescription uploaded for medicine ID: ${selectedMedicine}`)

      // Check if the product is already in the cart
      if (!cart.includes(selectedMedicine)) {
        const newCart = [...cart, selectedMedicine]
        setCart(newCart)
        // Store in localStorage to persist between pages
        localStorage.setItem("medicineCart", JSON.stringify(newCart))
        alert(`Medicine added to cart with prescription!`)
      } else {
        alert(`Medicine already in cart!`)
      }

      // Reset the modal state
      setShowPrescriptionModal(false)
      setPrescription(null)
      setPrescriptionPreview("")
      setSelectedMedicine(null)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  // Load cart from localStorage on component mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem("medicineCart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button
            onClick={handleGoBack}
            className="mr-4 flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Available Medicines</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="flex items-center gap-2 text-green-600 hover:text-green-800">
            <ShoppingCart />
            <span className="font-semibold">{cart.length} items</span>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Some medicines require a valid prescription. You will be prompted to upload your prescription before
                checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MEDICINES.map((medicine) => (
          <div key={medicine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={medicine.image || "/placeholder.svg"}
                alt={medicine.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                {medicine.discount} OFF
              </div>
              <button
                onClick={() => toggleWishlist(medicine.id)}
                className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md"
              >
                <Heart
                  className={`w-5 h-5 ${wishlist.includes(medicine.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
              {medicine.requiresPrescription && (
                <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  Prescription Required
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{medicine.name}</h2>
                <div className="flex items-center">
                  <div className="flex">
                    {medicine.reviews.length > 0 ? (
                      [...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i <
                            Math.round(
                              medicine.reviews.reduce((acc, review) => acc + review.rating, 0) /
                                medicine.reviews.length,
                            )
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No reviews</span>
                    )}
                  </div>
                  {medicine.reviews.length > 0 && (
                    <span className="text-sm text-gray-500 ml-1">({medicine.reviews.length})</span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">Vendor: {medicine.vendor}</p>
              <p className="text-xs text-gray-500 mb-2">Category: {medicine.category}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-green-600">${medicine.discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${medicine.originalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Expires:</span> {new Date(medicine.expiryDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Qty:</span> {medicine.quantity} left
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{medicine.description}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => addToCart(medicine.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  {medicine.requiresPrescription ? "Add with Prescription" : "Add to Cart"}
                </button>

                <button
                  onClick={() => toggleProductDetails(medicine.id)}
                  className="w-full bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md transition duration-300"
                >
                  {expandedProduct === medicine.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expandedProduct === medicine.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold mb-2">Product Description</h3>
                  <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>

                  {medicine.reviews.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-2">Reviews</h3>
                      <div className="space-y-3">
                        {medicine.reviews.map((review) => (
                          <div key={review.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{review.user}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Upload Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Upload Prescription</h2>
            <p className="text-gray-600 mb-4">
              This medication requires a valid prescription. Please upload a clear image of your prescription.
            </p>

            <div className="mb-4">
              {prescriptionPreview ? (
                <div className="relative">
                  <img
                    src={prescriptionPreview || "/placeholder.svg"}
                    alt="Prescription preview"
                    className="w-full h-48 object-contain border rounded-md"
                  />
                  <button
                    onClick={() => {
                      setPrescription(null)
                      setPrescriptionPreview("")
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">Supported formats: JPG, PNG, PDF</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePrescriptionUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPrescriptionModal(false)
                  setPrescription(null)
                  setPrescriptionPreview("")
                  setSelectedMedicine(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePrescriptionSubmit}
                disabled={!prescription}
                className={`px-4 py-2 rounded-md text-white ${
                  prescription ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

