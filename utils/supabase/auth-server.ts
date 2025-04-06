// utils/supabase/auth-server.ts

import { getServerSupabaseClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

// Get session on server
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = getServerSupabaseClient()
    const { data } = await supabase.auth.getSession()
    return data?.session ?? null
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

// Redirect if not authenticated
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/signup")
  }
  return session
}

// Fetch user profile from server
export async function getUserProfile(userId: string) {
  try {
    const supabase = getServerSupabaseClient()
    const { data, error } = await supabase
      .from("users")
      .select("role, category")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}
