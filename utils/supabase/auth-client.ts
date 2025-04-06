// utils/supabase/auth-client.ts

"use client"

import { createClientComponentClient } from "@/utils/supabase/client"
import type { Session } from "@supabase/supabase-js"

export const clientAuth = {
  signUp: async (email: string, password: string, name: string) => {
    const supabase = createClientComponentClient()
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
  
    if (authError) {
      return { success: false, user: null, error: authError.message }
    }
  
    if (authData.user) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email,
          name,
          role: "user",
          category: "pending",
        },
      ])
      if (profileError) {
        return { success: false, user: null, error: profileError.message }
      }
    }
  
    return { success: true, user: authData.user, error: null }
  },  

  signIn: async (email: string, password: string) => {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  
    return {
      success: !error,
      user: data.user,
      session: data.session,
      error: error?.message || null,
    }
  },
  

  signOut: async () => {
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  },

  getSession: async (): Promise<{ success: boolean; session: Session | null }> => {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { success: true, session: data.session }
  },

  updateUserRole: async (userId: string, role: "vendor" | "user") => {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId)
      .select()
    if (error) throw error
    return { success: true, user: data[0] }
  },
}
