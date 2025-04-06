"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"
import { createClientComponentClient } from "@/utils/supabase/client"

export default function ConfirmEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (!token || type !== "email_confirmation") {
          setStatus("error")
          setMessage("Invalid confirmation link. Please try signing in to receive a new confirmation email.")
          return
        }

        const supabase = createClientComponentClient()

        // Verify the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        })

        if (error) {
          throw error
        }

        setStatus("success")
        setMessage("Your email has been confirmed successfully! You can now sign in to your account.")

        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } catch (error: any) {
        console.error("Error confirming email:", error)
        setStatus("error")
        setMessage(
          error.message || "Failed to confirm your email. Please try signing in to receive a new confirmation email.",
        )
      }
    }

    confirmEmail()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirming Your Email</h1>
            <p className="text-gray-600">Please wait while we confirm your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Confirmed!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/auth/login"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
            >
              Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/auth/login"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
            >
              Go to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

