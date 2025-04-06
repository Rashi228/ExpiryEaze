"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Plus, X, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VendorDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    originalPrice: "",
    discountedPrice: "",
    expiryDate: "",
    quantity: "",
    description: "",
    image: null as File | null,
    imagePreview: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewProduct({
        ...newProduct,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate discount percentage
    const originalPrice = Number.parseFloat(newProduct.originalPrice)
    const discountedPrice = Number.parseFloat(newProduct.discountedPrice)
    const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)

    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      discount: `${discountPercentage}%`,
      expiryDate: newProduct.expiryDate,
      quantity: Number.parseInt(newProduct.quantity),
      description: newProduct.description,
      image: newProduct.imagePreview || "/placeholder.svg?height=200&width=200",
      createdAt: new Date().toISOString(),
    }

    setProducts([productToAdd, ...products])
    setIsAddingProduct(false)
    setNewProduct({
      name: "",
      originalPrice: "",
      discountedPrice: "",
      expiryDate: "",
      quantity: "",
      description: "",
      image: null,
      imagePreview: "",
    })
  }

  const handleGoBack = () => {
    router.back()
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
        </div>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2 transition duration-300"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {isAddingProduct ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Product</h2>
            <button onClick={() => setIsAddingProduct(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col items-center justify-center">
              <div className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 relative">
                {newProduct.imagePreview ? (
                  <>
                    <img
                      src={newProduct.imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, image: null, imagePreview: "" })}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop an image or click to browse</p>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={newProduct.expiryDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={newProduct.originalPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price ($)
              </label>
              <input
                type="number"
                id="discountedPrice"
                name="discountedPrice"
                value={newProduct.discountedPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Available
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {product.discount} OFF
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>

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

                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h2>
          <p className="text-gray-500 mb-6">Start adding your near-expiry products to reach customers.</p>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md inline-flex items-center gap-2 transition duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  )
}

