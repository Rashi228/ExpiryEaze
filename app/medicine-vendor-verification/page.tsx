"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Upload, Check, X, AlertCircle, ArrowLeft } from "lucide-react"

export default function MedicineVendorVerification() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    licenseNumber: "",
    qualification: "",
    yearsOfExperience: "",
    pharmacyName: "",
  })
  const [documents, setDocuments] = useState({
    license: null as File | null,
    licensePreview: "",
    certification: null as File | null,
    certificationPreview: "",
    businessRegistration: null as File | null,
    businessRegistrationPreview: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "license" | "certification" | "businessRegistration",
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (fileType === "license") {
        setDocuments({
          ...documents,
          license: file,
          licensePreview: URL.createObjectURL(file),
        })
      } else if (fileType === "certification") {
        setDocuments({
          ...documents,
          certification: file,
          certificationPreview: URL.createObjectURL(file),
        })
      } else if (fileType === "businessRegistration") {
        setDocuments({
          ...documents,
          businessRegistration: file,
          businessRegistrationPreview: URL.createObjectURL(file),
        })
      }

      // Clear error when file is uploaded
      if (errors[fileType]) {
        setErrors({ ...errors, [fileType]: "" })
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required"
    }

    if (!formData.qualification.trim()) {
      newErrors.qualification = "Qualification is required"
    }

    if (!formData.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = "Years of experience is required"
    }

    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = "Pharmacy/Business name is required"
    }

    if (!documents.license) {
      newErrors.license = "License document is required"
    }

    if (!documents.certification) {
      newErrors.certification = "Certification document is required"
    }

    if (!documents.businessRegistration) {
      newErrors.businessRegistration = "Business registration document is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call for verification
      setTimeout(() => {
        console.log("Form data:", formData)
        console.log("Documents:", documents)

        // Redirect to vendor dashboard after verification
        router.push("/vendor-dashboard")
      }, 2000)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="mr-4 flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Medicine Vendor Verification</h1>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                To sell medicines on our platform, we need to verify your credentials. Please provide accurate
                information and valid documents.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Pharmacy/Business Name
                    </label>
                    <input
                      type="text"
                      id="pharmacyName"
                      name="pharmacyName"
                      value={formData.pharmacyName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.pharmacyName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.pharmacyName && <p className="mt-1 text-sm text-red-600">{errors.pharmacyName}</p>}
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.licenseNumber ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.licenseNumber && <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Qualification
                    </label>
                    <select
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.qualification ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="">Select qualification</option>
                      <option value="Pharmacist">Pharmacist</option>
                      <option value="Pharmacy Technician">Pharmacy Technician</option>
                      <option value="Medical Doctor">Medical Doctor</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
                  </div>

                  <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 border ${errors.yearsOfExperience ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    />
                    {errors.yearsOfExperience && (
                      <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Required Documents</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy/Medical License</label>
                      <div
                        className={`border-2 ${errors.license ? "border-red-300" : "border-gray-300"} ${documents.licensePreview ? "" : "border-dashed"} rounded-md`}
                      >
                        {documents.licensePreview ? (
                          <div className="relative p-2">
                            <div className="flex items-center">
                              <FileText className="w-8 h-8 text-green-500 mr-2" />
                              <div className="flex-1 truncate">
                                <p className="text-sm font-medium text-gray-900 truncate">{documents.license?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {documents.license?.size ? `${(documents.license.size / 1024).toFixed(2)} KB` : ""}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setDocuments({ ...documents, license: null, licensePreview: "" })}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <Check className="w-5 h-5 text-green-500" />
                              <span className="text-xs text-green-500 ml-1">Uploaded</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center relative">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Drag and drop your license document or click to browse
                            </p>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, "license")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      {errors.license && <p className="mt-1 text-sm text-red-600">{errors.license}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Certification</label>
                      <div
                        className={`border-2 ${errors.certification ? "border-red-300" : "border-gray-300"} ${documents.certificationPreview ? "" : "border-dashed"} rounded-md`}
                      >
                        {documents.certificationPreview ? (
                          <div className="relative p-2">
                            <div className="flex items-center">
                              <FileText className="w-8 h-8 text-green-500 mr-2" />
                              <div className="flex-1 truncate">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {documents.certification?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {documents.certification?.size
                                    ? `${(documents.certification.size / 1024).toFixed(2)} KB`
                                    : ""}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setDocuments({ ...documents, certification: null, certificationPreview: "" })
                                }
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <Check className="w-5 h-5 text-green-500" />
                              <span className="text-xs text-green-500 ml-1">Uploaded</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center relative">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Drag and drop your certification document or click to browse
                            </p>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, "certification")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      {errors.certification && <p className="mt-1 text-sm text-red-600">{errors.certification}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration</label>
                      <div
                        className={`border-2 ${errors.businessRegistration ? "border-red-300" : "border-gray-300"} ${documents.businessRegistrationPreview ? "" : "border-dashed"} rounded-md`}
                      >
                        {documents.businessRegistrationPreview ? (
                          <div className="relative p-2">
                            <div className="flex items-center">
                              <FileText className="w-8 h-8 text-green-500 mr-2" />
                              <div className="flex-1 truncate">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {documents.businessRegistration?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {documents.businessRegistration?.size
                                    ? `${(documents.businessRegistration.size / 1024).toFixed(2)} KB`
                                    : ""}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setDocuments({
                                    ...documents,
                                    businessRegistration: null,
                                    businessRegistrationPreview: "",
                                  })
                                }
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="mt-2 flex justify-end">
                              <Check className="w-5 h-5 text-green-500" />
                              <span className="text-xs text-green-500 ml-1">Uploaded</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-center relative">
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Drag and drop your business registration document or click to browse
                            </p>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(e, "businessRegistration")}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      {errors.businessRegistration && (
                        <p className="mt-1 text-sm text-red-600">{errors.businessRegistration}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                      isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isSubmitting ? "Submitting for Verification..." : "Submit for Verification"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

