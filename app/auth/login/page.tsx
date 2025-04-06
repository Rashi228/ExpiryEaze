"use client"

import type React from "react"

import { clientAuth } from "@/utils/supabase/auth-client"
import { createClientComponentClient } from "@/utils/supabase/client"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await clientAuth.signIn(email, password)

      if (!isMounted.current) return

      if (!result.success) {
        setError(result.error || "Failed to sign in")
        setIsLoading(false)
        return
      }

      // Fetch user profile to determine redirect
      try {
        const supabase = createClientComponentClient()
        const { data: userData } = await supabase
          .from("users")
          .select("role, category")
          .eq("id", result.user?.id)
          .single()

        if (!isMounted.current) return

        // Redirect based on user role and category
        if (userData) {
          isMounted.current = false

          // If user has a "pending" category, redirect to join-waitlist
          if (userData.category === "pending") {
            if (userData.role === "user") {
              router.push(`/user-category-selection?userId=${result.user?.id}`)
            } else if (userData.role === "vendor") {
              router.push(`/vendor-category-selection?userId=${result.user?.id}`)
            } else {
              router.push("/join-waitlist")
            }
            return
          }

          if (userData.role === "user") {
            if (userData.category === "groceries") {
              router.push("/user-dashboard")
            } else {
              router.push("/medicines-dashboard")
            }
          } else if (userData.role === "vendor") {
            if (userData.category === "groceries") {
              router.push("/vendor-dashboard")
            } else {
              router.push("/medicine-vendor-verification")
            }
          } else {
            router.push("/")
          }
        } else {
          router.push("/join-waitlist")
        }
      } catch (profileError: any) {
        console.error("Error fetching user profile:", profileError)
        // If we can't fetch the profile, just redirect to join-waitlist
        router.push("/join-waitlist")
      }
    } catch (err: any) {
      if (isMounted.current) {
        console.error("Login error:", err)
        setError(err.message || "A network error occurred. Please check your connection and try again.")
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 md:p-10 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-center text-gray-600 text-sm md:text-base mb-6">Sign in to your ExpiryEaze account</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error.includes("Failed to fetch") || error.includes("network")
                    ? "A network error occurred. Please check your connection and try again."
                    : error.includes("Invalid login credentials")
                      ? "Invalid email or password. Please try again."
                      : error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

