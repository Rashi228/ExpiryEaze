"use client"

import { useState } from "react"
import { Star, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"

// Mock product data
const PRODUCTS = [
  {
    id: 1,
    name: "Organic Apples",
    vendor: "Green Grocers",
    originalPrice: 5.99,
    discountedPrice: 2.99,
    discount: "50%",
    expiryDate: "2025-03-25",
    quantity: 10,
    image: "/placeholder.svg?height=200&width=200",
    description: "Fresh organic apples sourced from local farms. Perfect for snacking or baking.",
    reviews: [
      { id: 1, user: "John D.", rating: 5, comment: "Very fresh and tasty!" },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Good quality for the price." },
    ],
  },
  {
    id: 2,
    name: "Whole Grain Bread",
    vendor: "Healthy Bakery",
    originalPrice: 4.5,
    discountedPrice: 2.25,
    discount: "50%",
    expiryDate: "2025-03-23",
    quantity: 5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Nutritious whole grain bread made with organic flour. High in fiber and protein.",
    reviews: [
      { id: 1, user: "Mike T.", rating: 5, comment: "Best bread I've ever had!" },
      { id: 2, user: "Lisa R.", rating: 5, comment: "Stays fresh for days." },
    ],
  },
  {
    id: 3,
    name: "Greek Yogurt",
    vendor: "Dairy Delights",
    originalPrice: 3.99,
    discountedPrice: 1.99,
    discount: "50%",
    expiryDate: "2025-03-24",
    quantity: 8,
    image: "/placeholder.svg?height=200&width=200",
    description: "Creamy Greek yogurt with high protein content. Perfect for breakfast or snacks.",
    reviews: [
      { id: 1, user: "Emma W.", rating: 4, comment: "Creamy and delicious." },
      { id: 2, user: "David K.", rating: 3, comment: "Good but a bit too tangy for me." },
    ],
  },
  {
    id: 4,
    name: "Vitamin C Supplements",
    vendor: "Health Essentials",
    originalPrice: 12.99,
    discountedPrice: 7.79,
    discount: "40%",
    expiryDate: "2025-06-15",
    quantity: 15,
    image: "/placeholder.svg?height=200&width=200",
    description: "High-quality Vitamin C supplements to boost your immune system.",
    reviews: [
      { id: 1, user: "Robert J.", rating: 5, comment: "Noticed a difference in my energy levels!" },
      { id: 2, user: "Patricia L.", rating: 4, comment: "Easy to swallow and no aftertaste." },
    ],
  },
]

export default function UserDashboard() {
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)

  const addToCart = (productId: number) => {
    setCart([...cart, productId])
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Products</h1>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="flex items-center gap-2 text-green-600 hover:text-green-800">
            <ShoppingCart />
            <span className="font-semibold">{cart.length} items</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                {product.discount} OFF
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md"
              >
                <Heart
                  className={`w-5 h-5 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i <
                          Math.round(
                            product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length,
                          )
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">({product.reviews.length})</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2">Vendor: {product.vendor}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-green-600">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Expires:</span> {new Date(product.expiryDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Qty:</span> {product.quantity} left
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleProductDetails(product.id)}
                  className="w-full bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md transition duration-300"
                >
                  {expandedProduct === product.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expandedProduct === product.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold mb-2">Product Description</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                  <h3 className="font-semibold mb-2">Reviews</h3>
                  <div className="space-y-3">
                    {product.reviews.map((review) => (
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
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

