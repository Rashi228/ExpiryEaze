"use client"

import { clientAuth } from "@/utils/supabase/auth-client"
import { createClientComponentClient } from "@/utils/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/terms",
  "/privacy",
  "/join-waitlist",
  "/user-dashboard",
  "/medicines-dashboard",
  "/vendor-dashboard",
  "/medicine-vendor-verification",
]

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for public routes
        if (publicRoutes.includes(pathname)) {
          setIsLoading(false)
          return
        }

        // Check if user is authenticated
        const { success, session } = await clientAuth.getSession()

        if (!success || !session) {
          // Redirect to signup if not authenticated
          router.push("/auth/signup")
          return
        }

        // Fetch user role & category only if necessary
        if (pathname.includes("/vendor-dashboard") || pathname.includes("/medicine-vendor-verification")) {
          const supabase = createClientComponentClient()
          const { data, error } = await supabase
            .from("users")
            .select("role, category")
            .eq("id", session.user.id)
            .single()

          if (error || !data) {
            router.push("/user-dashboard")
            return
          }

          // Vendor role check
          if (data.role !== "vendor") {
            router.push("/user-dashboard")
            return
          }

          // Category-based redirection logic
          if (pathname.includes("/vendor-dashboard") && data.category !== "groceries") {
            router.push("/medicine-vendor-verification")
            return
          }

          if (pathname.includes("/medicine-vendor-verification") && data.category !== "medicines") {
            router.push("/vendor-dashboard")
            return
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth check error:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    // Show loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return <>{children}</>
}

