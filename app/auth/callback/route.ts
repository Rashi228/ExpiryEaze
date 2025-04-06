import { createServerComponentClient } from "@/utils/supabase/server"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createServerComponentClient()

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the user data
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase.from("users").select("*").eq("id", session.user.id).single()

      // If user doesn't exist in our table, create a profile
      if (!existingUser) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata.full_name || session.user.email?.split("@")[0],
          role: "user", // Default role for OAuth users
          category: "pending",
        }

        await supabase.from("users").insert([userData])

        // Redirect to join waitlist
        return NextResponse.redirect(new URL(`/join-waitlist`, requestUrl.origin))
      } else {
        // Redirect based on existing user role and category
        if (existingUser.category && existingUser.category !== "pending") {
          if (existingUser.role === "user") {
            if (existingUser.category === "groceries") {
              return NextResponse.redirect(new URL("/user-dashboard", requestUrl.origin))
            } else {
              return NextResponse.redirect(new URL("/medicines-dashboard", requestUrl.origin))
            }
          } else if (existingUser.role === "vendor") {
            if (existingUser.category === "groceries") {
              return NextResponse.redirect(new URL("/vendor-dashboard", requestUrl.origin))
            } else {
              return NextResponse.redirect(new URL("/medicine-vendor-verification", requestUrl.origin))
            }
          }
        } else if (existingUser.category === "pending") {
          if (existingUser.role === "user") {
            return NextResponse.redirect(
              new URL(`/user-category-selection?userId=${session.user.id}`, requestUrl.origin),
            )
          } else if (existingUser.role === "vendor") {
            return NextResponse.redirect(
              new URL(`/vendor-category-selection?userId=${session.user.id}`, requestUrl.origin),
            )
          }
        } else {
          // If role exists but no category, redirect to join waitlist
          return NextResponse.redirect(new URL("/join-waitlist", requestUrl.origin))
        }
      }
    }
  }

  // Default redirect to home page
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}

