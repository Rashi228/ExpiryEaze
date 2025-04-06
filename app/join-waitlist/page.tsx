"use client"

import type React from "react"
import { clientAuth } from "@/utils/supabase/auth-client"
import { createClientComponentClient } from "@/utils/supabase/client"
import { AlertCircle, Building2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { submitWaitlistForm } from "./actions"



export default function JoinWaitlist() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const isMounted = useRef(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  })

  // Cleanup function to prevent state updates after unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Check if user is authenticated and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { success, session } = await clientAuth.getSession()

        if (!success || !session) {
          // Redirect to signup if not authenticated
          router.push("/auth/signup")
          return
        }

        // Store auth user data
        setAuthUser(session.user)

        // Fetch user data from database - don't use .single() to avoid the error
        const supabase = createClientComponentClient()
        const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id)

        if (error) {
          console.error("Error fetching user data:", error)
          setError("Error fetching your profile. Please try signing in again.")
          setIsLoading(false)
          return
        }

        if (isMounted.current) {
          // Check if we got any user data back
          if (data && data.length > 0) {
            const userRecord = data[0]
            setUserData(userRecord)

            // Initialize form data with user data
            setFormData({
              name: userRecord.name || session.user.user_metadata?.name || "",
              email: userRecord.email || session.user.email || "",
              phone: userRecord.phone || "",
              location: userRecord.location || "",
            })

            // If user has completed the role selection and category selection process
            if (userRecord.category && userRecord.category !== "pending") {
              if (userRecord.role === "user") {
                if (userRecord.category === "groceries") {
                  router.push("/user-dashboard")
                } else {
                  router.push("/medicines-dashboard")
                }
              } else if (userRecord.role === "vendor") {
                if (userRecord.category === "groceries") {
                  router.push("/vendor-dashboard")
                } else {
                  router.push("/medicine-vendor-verification")
                }
              }
              return
            }

            // If user has selected a role but not a category, redirect to category selection
            if (userRecord.category === "pending" && userRecord.role) {
              if (userRecord.role === "user") {
                router.push(`/user-category-selection?userId=${session.user.id}`)
                return
              } else if (userRecord.role === "vendor") {
                router.push(`/vendor-category-selection?userId=${session.user.id}`)
                return
              }
            }
          } else {
            // No user record found, initialize form with session data
            console.log("No user record found, initializing with session data")
            setFormData({
              name: session.user.user_metadata?.name || "",
              email: session.user.email || "",
              phone: "",
              location: "",
            })

            // Check if a user with this email already exists before creating a new record
            try {
              // First check if a user with this ID already exists
              const { data: existingUserById, error: idLookupError } = await supabase
                .from("users")
                .select("*")
                .eq("id", session.user.id)
                .maybeSingle()

              if (idLookupError) {
                console.error("Error checking for existing user by ID:", idLookupError)
              } else if (existingUserById) {
                // User with this ID already exists, use that record
                console.log("Found existing user with this ID:", existingUserById)
                setUserData(existingUserById)
                setFormData({
                  name: existingUserById.name || session.user.user_metadata?.name || "",
                  email: existingUserById.email || session.user.email || "",
                  phone: existingUserById.phone || "",
                  location: existingUserById.location || "",
                })
                setIsLoading(false)
                return
              }

              // Then check if a user with the same email exists
              if (session.user.email) {
                const { data: existingUserByEmail, error: emailLookupError } = await supabase
                  .from("users")
                  .select("*")
                  .eq("email", session.user.email)
                  .maybeSingle()

                if (emailLookupError) {
                  console.error("Error checking for existing user by email:", emailLookupError)
                } else if (existingUserByEmail) {
                  // User with this email already exists, use that record
                  console.log("Found existing user with this email:", existingUserByEmail)
                  setUserData(existingUserByEmail)
                  setFormData({
                    name: existingUserByEmail.name || session.user.user_metadata?.name || "",
                    email: existingUserByEmail.email || session.user.email || "",
                    phone: existingUserByEmail.phone || "",
                    location: existingUserByEmail.location || "",
                  })
                  setIsLoading(false)
                  return
                }
              }

              // No existing user found, create a new one with a more careful approach
              console.log("No existing user found, creating new user record")
              const { error: insertError, data: insertData } = await supabase
                .from("users")
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
                    role: "user", // Default role
                    category: "pending",
                  },
                ])
                .select()

              if (insertError) {
                console.error("Error creating user record:", insertError)

                // If there's a duplicate key error, try to fetch the existing user one more time
                if (insertError.message.includes("duplicate key") && session.user.email) {
                  console.log("Duplicate key error, trying to fetch existing user by email again")
                  const { data: existingUser, error: fetchError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", session.user.email)
                    .single()

                  if (fetchError) {
                    console.error("Error fetching existing user after insert error:", fetchError)
                    setError("Error creating your profile. Please try signing in again.")
                  } else if (existingUser) {
                    console.log("Found existing user after insert error:", existingUser)
                    setUserData(existingUser)
                    setFormData({
                      name: existingUser.name || session.user.user_metadata?.name || "",
                      email: existingUser.email || session.user.email || "",
                      phone: existingUser.phone || "",
                      location: existingUser.location || "",
                    })
                  } else {
                    setError("Error creating your profile. Please try signing in again.")
                  }
                } else {
                  setError("Error creating your profile. Please try signing in again.")
                }
              } else if (insertData && insertData.length > 0) {
                setUserData(insertData[0])
              }
            } catch (insertErr) {
              console.error("Exception creating user record:", insertErr)
              setError("An unexpected error occurred. Please try signing in again.")
            }
          }
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error in authentication check:", err)
        if (isMounted.current) {
          setError("Authentication error. Please try signing in again.")
          setIsLoading(false)
        }
      }
    }

    checkAuth()
  }, [router])

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Check if we have auth user data
    if (!authUser) {
      setError("Authentication error. Please try signing in again.")
      setIsSubmitting(false)
      return
    }

    // Validate that the email matches the one they signed up with
    if (formData.email !== authUser.email) {
      setError("Please use the same email address you used to sign up.")
      setIsSubmitting(false)
      return
    }

    try {
      // If userData doesn't exist yet, create it first
      if (!userData) {
        const supabase = createClientComponentClient()

        // Check if a user with this email already exists
        const { data: existingUser, error: existingUserError } = await supabase
          .from("users")
          .select("*")
          .eq("email", authUser.email)
          .maybeSingle()

        if (existingUserError) {
          console.error("Error checking for existing user:", existingUserError)
          setError("Error checking for existing user. Please try again.")
          setIsSubmitting(false)
          return
        }

        if (existingUser) {
          // Use existing user
          console.log("Using existing user record:", existingUser)
          setUserData(existingUser)

          // Update the existing user's role
          const { error: updateError } = await supabase
            .from("users")
            .update({ role: selectedRole as "vendor" | "user" })
            .eq("id", existingUser.id)

          if (updateError) {
            console.error("Error updating existing user role:", updateError)
            setError("Error updating your profile. Please try again.")
            setIsSubmitting(false)
            return
          }
        } else {
          // Create new user
          const { data, error } = await supabase
            .from("users")
            .insert([
              {
                id: authUser.id,
                email: authUser.email,
                name: formData.name,
                role: selectedRole as "vendor" | "user",
                category: "pending",
              },
            ])
            .select()

          if (error) {
            console.error("Error creating user record:", error)
            setError("Error creating your profile. Please try again.")
            setIsSubmitting(false)
            return
          }

          if (data && data.length > 0) {
            setUserData(data[0])
          }
        }
      } else {
        // Update the user's role
        const roleUpdateResult = await clientAuth.updateUserRole(userData.id, selectedRole as "vendor" | "user")

        if (!isMounted.current) return

        if (!roleUpdateResult.success) {
          setError("Failed to update user role.")
          setIsSubmitting(false)
          return
        }
      }

      // Submit the form data to our server action
      const serverFormData = new FormData()
      serverFormData.append("name", formData.name)
      serverFormData.append("email", formData.email)
      serverFormData.append("phone", formData.phone)
      serverFormData.append("location", formData.location)
      serverFormData.append("role", selectedRole || "")
      serverFormData.append("userId", authUser.id)

      const result = await submitWaitlistForm(serverFormData)

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
    } catch (err: any) {
      // Check if component is still mounted before updating state
      if (isMounted.current) {
        console.error("Error in form submission:", err)
        setError(`An error occurred: ${err.message || "Please try again."}`)
        setIsSubmitting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error && !selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
          >
            Sign In Again
          </button>
        </div>
      </div>
    )
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Select Your Role</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vendor Card */}
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Vendor</h2>
              <p className="text-gray-600 mb-8">Register as a business to list your products and manage inventory</p>
              <button
                onClick={() => handleRoleSelect("vendor")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Continue as Vendor
              </button>
            </div>

            {/* User Card */}
            <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">User</h2>
              <p className="text-gray-600 mb-8">Sign up as a consumer to access exclusive deals and manage purchases</p>
              <button
                onClick={() => handleRoleSelect("user")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Continue as User
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-6 md:p-10 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
            Join as {selectedRole === "vendor" ? "Vendor" : "User"}
          </h1>
          <p className="text-center text-gray-600 text-sm md:text-base mb-6 md:mb-8">
            Be part of the solution for a sustainable future.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please use the same email address you used to sign up: {authUser?.email}
            </p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
